
var MODE ={
  // TODO: different instructions can have addressing mode reversed, convert to array instead of bitmap
  NONE         : 0,
  ADDR11       : 1 << 0,
  ADDR16       : 1 << 1,
  A            : 1 << 2,
  DIRECT       : 1 << 3,
  R0           : 1 << 4,
  R1           : 1 << 5,
  R2           : 1 << 6,
  R3           : 1 << 7,
  R4           : 1 << 8,
  R5           : 1 << 9,
  R6           : 1 << 10,
  R7           : 1 << 11,
  BIT          : 1 << 12,
  OFFSET       : 1 << 13,
  INDIRECTR0   : 1 << 14,
  INDIRECTR1   : 1 << 15,
  INDIRECTDPTR : 1 << 16,
  INDIRECTA    : 1 << 17,
  IMMEDIATE    : 1 << 18,
  AB           : 1 << 19,
  AINDIRECTPC  : 1 << 20,
  CARRY        : 1 << 21,
  INDIRECTADPTR: 1 << 22
}
var REG = {
  P0    : 0x80, // Port 0
  SP    : 0x81, // Stack Pointer
  DPL   : 0x82, // Data pointer low
  DPH   : 0x83, // Data Pointer High
  PCON  : 0x87, // Power Control
  TCON  : 0x88, // Timer Control
  TMOD  : 0x89, // Timer Mode
  TL0   : 0x8A, // Timer 0: Low Byte
  TL1   : 0x8B, // Timer 1: Low Byte
  TH0   : 0x8C, // Timer 0: High Byte
  TH1   : 0x8D, // Timer 1: High Byte
  P1    : 0x90, // Port 1
  SCON  : 0x98, // Serial Configuration
  SBUF  : 0x99, // Serial Buffer
  P2    : 0xA0, // Port 2
  IE    : 0xA8, // Interrupt Enable
  P3    : 0xB0, // Port 3
  IP    : 0xB8, // Interrupt Priority
  PSW   : 0xD0, // Program Status Word
  A     : 0xE0, // Accumulator
  B     : 0xF0  // B Register
}
var BITS ={
  CY   : 0x07,  // Carry flag
  AC   : 0x06,  // Auxillary Carry Flag (BCD)
  F0   : 0x05,  // Flag 0 (general purpose)
  RS1  : 0x04,  // Register Select 1
  RS0  : 0x03,  // Register Select 0
  OV   : 0x02,  // Overflow Flag
  UD   : 0x01,  // User Defined Flag
  P    : 0x00   // Parity Flag
}



var DEBUG_MODE = true;
function log(message) {
  if(DEBUG_MODE) {
    var l = document.getElementById("log");
    l.value = l.value+message+"\n";
    l.scrollTop = l.scrollHeight;
  }
}
/**
 * 8051 Processor Emulator
 */
function JS51() {
  this._ROM = new Array(256);
  this._ROM = [
    "04", // Increment A
    "01", "00" // AJMP 0
  ]
  this._memory = new Array(256);
  this._PC = 0;
  for(var i=0; i < this._memory.length; i++) {
    this._memory[i] = new Byte(0).setName("MEM["+parseInt(i,16)+"]");
  }
  for(name in REG) {
    this.getMemory(REG[name]).setName(name);
  }
  var processor = this;
  var a = this.getA();
  a.onChange.push(function() {
    var x = a.getValue();
    var parity = 0;
    while (x > 0) {
      parity = (parity + (x & 1)) % 2;
      x >>= 1;
    }
    processor.getPSW().writeBit(BITS.PARITY, parity)
  })
}

JS51.prototype.fetch = function() {
  if(this._PC >= this._ROM.length)
    throw "Ran past program size: "+this._PC + " >="+this._ROM.length;
  var op = parseInt("0x"+this._ROM[this._PC]);
  this.decode(op);
}
JS51.prototype.decode = function(op) {
  var opcode = this.opcodes[op];
  var trailing = "";
  this._PC++;
  for(var i = 1; i < opcode.bytes; i++)
    trailing += this._ROM[this._PC++];
  log(opcode.name+"("+trailing+")");
  opcode.execute(this, trailing);
}

/**
 * Dictionary/enum of all addressing modes
 * @type {Enum}
 */
JS51.prototype.getMemory = function(address) {
  switch(address) {
  default:
    return this._memory[address];
  }
}
JS51.prototype.getIndirect = function(byte) {
  return this.getMemory(byte.getValue());
}
JS51.prototype.registerIndirect = function(registerNumber) {
  return this.getIndirect(this.getRegister(registerNumber).getValue());
}
JS51.prototype.setMemory = function(address, value) {
  switch(address) {
    default:
      this._memory[address].setValue(value);
      return;
  }
}
JS51.prototype.getRegister = function(registerNumber) {
  if(registerNumber > 7)
    throw "Invalid register number";
  var registerStart = 16 * this.getPSW().getBit(BITS.RS1) +
                      8  * this.getPSW().getBit(BITS.RS0);
  return this.getMemory(registerNumber+registerStart);
}
JS51.prototype.getA = function() {
  return this.getMemory(REG.A);
}
JS51.prototype.getB = function() {
  return this.getMemory(REG.B);
}
JS51.prototype.getPSW = function() {
  return this.getMemory(REG.PSW);
}
JS51.prototype.getPC = function() {
  return this._PC;
}
JS51.prototype.setPC = function(PC) {
  this._PC = PC;
}
JS51.prototype.jumpOffset = function(offset) {
  this._PC = this._PC + offset;
}
JS51.prototype.jump = function(address) {
  this._PC = address;
  return this;
}
JS51.prototype.call = function(address) {
  this.push(this._PC%256).push(this._PC/256);
  return this;
}
JS51.prototype.ret = function() {
  this._PC = this.popValue()*256+this.popValue();
}
JS51.prototype.push = function(value) {
  var stackPointer = this.getMemory(REG.SP);
  this.getIndirect(stackPointer.increment()).setValue(value);
  return this;
}
JS51.prototype.pushByte = function(byte) {
  var stackPointer = this.getMemory(REG.SP);
  this.getIndirect(stackPointer.increment()).setValue(byte.getValue());
  return this;
}
JS51.prototype.popValue = function() {
  var stackPointer = this.getMemory(REG.SP);
  var value = this.getIndirect(stackPointer).getValue();
  stackPointer.decrement();
  return value;
}
JS51.prototype.calculateAdditionFlags = function(operand1, operand2) {
  //TODO: Implement flags here
}
JS51.prototype.opcodes = [
{ // 0x00
  name        : "NOP" ,
  description : "No operation",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.NONE,
  execute     : function(processor, trailing) {
    // DO NOTHING
  }
},
{ // 0x01
  // TODO: figure out this http://www.keil.com/support/man/docs/is51/is51_ajmp.htm
  name        : "AJMP" ,
  description : "Absolute Jump",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {
    processor.setPC(parseInt("0x"+trailing));
  }
},
{ // 0x02
  name        : "LJMP" ,
  description : "Long Jump",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR16,
  execute     : function(processor, trailing) {
    processor.setPC(parseInt("0x"+trailing));
  }
},
{ // 0x03
  name        : "RR" ,
  description : "Rotate Right",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  execute     : function(processor, trailing) {
    processor.getA().rotateRight();
  }
},
{ // 0x04
  name        : "INC" ,
  description : "Increment Accumulator",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  execute     : function(processor, trailing) {
    processor.getA().increment();
  }
},
{ // 0x05
  name        : "INC" ,
  description : "Increment Memory Location",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT,
  execute     : function(processor, trailing) {
    var location = parseInt("0x"+trailing)
    processor.getMemory(location).increment();
  }
},
{ // 0x06
  name        : "INC" ,
  description : "Increment Register 0 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0,
  execute     : function(processor, trailing) {
    var location = parseInt("0x"+trailing)
    processor.registerIndirect(location).increment();
  }
},
{ // 0x07
  name        : "INC" ,
  description : "Increment Register 1 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1,
  execute     : function(processor, trailing) {
    var location = processor.getRegister(1).getValue();
    processor.getMemory(location).increment();
  }
},
{ // 0x08
  name        : "INC" ,
  description : "Increment R0",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0,
  execute     : function(processor, trailing) {
    processor.getRegister(0).increment();
  }
},
{ // 0x09
  name        : "INC" ,
  description : "Increment R1",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1,
  execute     : function(processor, trailing) {
    processor.getRegister(1).increment();

  }
},
{ // 0x0A
  name        : "INC" ,
  description : "Increment R2",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2,
  execute     : function(processor, trailing) {
    processor.getRegister(2).increment();
  }
},
{ // 0x0B
  name        : "INC" ,
  description : "Increment R3",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3,
  execute     : function(processor, trailing) {
    processor.getRegister(3).increment();

  }
},
{ // 0x0C
  name        : "INC" ,
  description : "Increment R4",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4,
  execute     : function(processor, trailing) {
    processor.getRegister(4).increment();
  }
},
{ // 0x0D
  name        : "INC" ,
  description : "Increment R5",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5,
  execute     : function(processor, trailing) {
    processor.getRegister(5).increment();
  }
},
{ // 0x0E
  name        : "INC" ,
  description : "Increment R6",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6,
  execute     : function(processor, trailing) {
    processor.getRegister(6).increment();
  }
},
{ // 0x0F
  name        : "INC" ,
  description : "Increment R7",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7,
  execute     : function(processor, trailing) {
    processor.getRegister(7).increment();
  }
},
{ // 0x10
  name        : "JBC" ,
  description : "Jump if Bit Set and Clear Bit",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT | MODE.OFFSET,
  execute     : function(processor, trailing) {
    // TODO: figure this guy out
  }
},
{ // 0x11
  name        : "ACALL" ,
  description : "Call Absolute Address",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0x12
  name        : "LCALL" ,
  description : "Call Long Address",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR16,
  execute     : function(processor, trailing) {

  }
},
{ // 0x13
  name        : "RRC" ,
  description : "Rotate Right with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  execute     : function(processor, trailing) {
    var toWrite = processor.getA();
    var PSW = processor.getPSW();
    var shiftOut = toWrite.getBit(0);
    var shiftIn = PSW.getBit(BITS.CARRY);
    toWrite.shiftRight().writeBit(7,shiftIn);
    PSW.writeBit(BITS.CARRY, shiftOut);
  }
},
{ // 0x14
  name        : "DEC" ,
  description : "Decrement Accumulator",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  execute     : function(processor, trailing) {
    processor.getA().decrement();
  }
},
{ // 0x15
  name        : "DEC" ,
  description : "Decrement Memory Location",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT,
  execute     : function(processor, trailing) {
    var location = parseInt("0x"+trailing);
    processor.getMemory(location).decrement();
  }
},
{ // 0x16
  name        : "DEC" ,
  description : "Decrement Register 0 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0,
  execute     : function(processor, trailing) {
    processor.registerIndirect(0).decrement();
  }
},
{ // 0x17
  name        : "DEC" ,
  description : "Decrement Register 1 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1,
  execute     : function(processor, trailing) {
    processor.registerIndirect(1).decrement();
  }
},
{ // 0x18
  name        : "DEC" ,
  description : "Decrement R0",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0,
  execute     : function(processor, trailing) {
    processor.getRegister(0).decrement();
  }
},
{ // 0x19
  name        : "DEC" ,
  description : "Decrement R1",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1,
  execute     : function(processor, trailing) {
    processor.getRegister(1).decrement();
  }
},
{ // 0x1A
  name        : "DEC" ,
  description : "Decrement R2",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2,
  execute     : function(processor, trailing) {
    processor.getRegister(2).decrement();
  }
},
{ // 0x1B
  name        : "DEC" ,
  description : "Decrement R3",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3,
  execute     : function(processor, trailing) {
    processor.getRegister(3).decrement();
  }
},
{ // 0x1C
  name        : "DEC" ,
  description : "Decrement R4",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4,
  execute     : function(processor, trailing) {
    processor.getRegister(4).decrement();
  }
},
{ // 0x1D
  name        : "DEC" ,
  description : "Decrement R5",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5,
  execute     : function(processor, trailing) {
    processor.getRegister(5).decrement();
  }
},
{ // 0x1E
  name        : "DEC" ,
  description : "Decrement R6",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6,
  execute     : function(processor, trailing) {
    processor.getRegister(6).decrement();
  }
},
{ // 0x1F
  name        : "DEC" ,
  description : "Decrement R7",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7,
  execute     : function(processor, trailing) {
    processor.getRegister(7).decrement();
  }
},
{ // 0x20
  name        : "JB" ,
  description : "Jump if Bit Set",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0x21
  name        : "AJMP" ,
  description : "Jump to Absolute Address",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0x22
  name        : "RET" ,
  description : "Return from call",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.NONE,
  execute     : function(processor, trailing) {
    processor.ret();
  }
},
{ // 0x23
  name        : "RL" ,
  description : "Rotate Left",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  execute     : function(processor, trailing) {
    processor.getA().rotateLeft();
  }
},
{ // 0x24
  name        : "ADD" ,
  description : "Add Immediate",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {
    var writeTo = processor.getA();
    var toAdd = parseInt("0x"+trailing)
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    writeTo.addValue(toAdd);
  }
},
{ // 0x25
  name        : "ADD" ,
  description : "Add Memory Location",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  execute     : function(processor, trailing) {
    var location = parseInt("0x"+trailing)
    var writeTo = processor.getA();
    var toAdd = processor.getMemory(location);
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    writeTo.addValue(toAdd)
  }
},
{ // 0x26
  name        : "ADD" ,
  description : "Add Register 0 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  execute     : function(processor, trailing) {
    var writeTo = processor.getA();
    var toAdd = processor.registerIndirect(0).getValue();
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x27
  name        : "ADD" ,
  description : "Add Register 1 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  execute     : function(processor, trailing) {
    var writeTo = processor.getA();
    var toAdd = processor.registerIndirect(1).getValue();
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x28
  name        : "ADD" ,
  description : "Add R0",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  execute     : function(processor, trailing) {
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(0).getValue();
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x29
  name        : "ADD" ,
  description : "Add R1",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  execute     : function(processor, trailing) {
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(1).getValue();
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x2A
  name        : "ADD" ,
  description : "Add R2",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  execute     : function(processor, trailing) {
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(2).getValue();
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x2B
  name        : "ADD" ,
  description : "Add R3",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  execute     : function(processor, trailing) {
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(3).getValue();
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x2C
  name        : "ADD" ,
  description : "Add R4",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  execute     : function(processor, trailing) {
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(4).getValue();
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x2D
  name        : "ADD" ,
  description : "Add R5",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  execute     : function(processor, trailing) {
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(5).getValue();
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x2E
  name        : "ADD" ,
  description : "Add R6",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  execute     : function(processor, trailing) {
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(6).getValue();
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x2F
  name        : "ADD" ,
  description : "Add R7",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  execute     : function(processor, trailing) {
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(7).getValue();
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x30
  name        : "JNB" ,
  description : "Jump if bit not set",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0x31
  name        : "ACALL" ,
  description : "Call to Absolute Address",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0x32
  name        : "RETI" ,
  description : "Return from Interrupt",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.NONE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x33
  name        : "RLC" ,
  description : "Rotate Left, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  execute     : function(processor, trailing) {
    var toWrite = processor.getA();
    var PSW = processor.getPSW();
    var shiftOut = toWrite.getBit(7);
    var shiftIn = PSW.getBit(BITS.CARRY);
    toWrite.shiftLeft().writeBit(0,shiftIn);
    PSW.writeBit(BITS.CARRY, shiftOut);
  }
},
{ // 0x34
  name        : "ADDC" ,
  description : "Add Immediate, with Carry",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {
    var writeTo = processor.getA();
    var carryValue = processor.getPSW().getBit(BITS.CARRY);
    var toAdd = parseInt("0x"+trailing)+carryValue;
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);

  }
},
{ // 0x35
  name        : "ADDC" ,
  description : "Add Direct, with Carry",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  execute     : function(processor, trailing) {
    var location = parseInt("0x"+trailing)
    var carryValue = processor.getPSW().getBit(BITS.CARRY);
    var writeTo = processor.getA();
    var toAdd = processor.getMemory(location).getValue()+carryValue;
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x36
  name        : "ADDC" ,
  description : "Add Register 0 Indirect, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  execute     : function(processor, trailing) {
    var carryValue = processor.getPSW().getBit(BITS.CARRY);
    var writeTo = processor.getA();
    var toAdd = processor.registerIndirect(0).getValue()+carryValue;
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);

  }
},
{ // 0x37
  name        : "ADDC" ,
  description : "Add Register 1 Indirect, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  execute     : function(processor, trailing) {
    var carryValue = processor.getPSW().getBit(BITS.CARRY);
    var writeTo = processor.getA();
    var toAdd = processor.registerIndirect(1).getValue()+carryValue;
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);

  }
},
{ // 0x38
  name        : "ADDC" ,
  description : "Add R0, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  execute     : function(processor, trailing) {
    var carryValue = processor.getPSW().getBit(BITS.CARRY);
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(0).getValue()+carryValue;
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x39
  name        : "ADDC" ,
  description : "Add R1, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  execute     : function(processor, trailing) {
    var carryValue = processor.getPSW().getBit(BITS.CARRY);
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(1).getValue()+carryValue;
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x3A
  name        : "ADDC" ,
  description : "Add R2, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  execute     : function(processor, trailing) {
    var carryValue = processor.getPSW().getBit(BITS.CARRY);
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(2).getValue()+carryValue;
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x3B
  name        : "ADDC" ,
  description : "Add R3, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  execute     : function(processor, trailing) {
    var carryValue = processor.getPSW().getBit(BITS.CARRY);
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(3).getValue()+carryValue;
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x3C
  name        : "ADDC" ,
  description : "Add R4, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  execute     : function(processor, trailing) {
    var carryValue = processor.getPSW().getBit(BITS.CARRY);
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(4).getValue()+carryValue;
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x3D
  name        : "ADDC" ,
  description : "Add R5, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  execute     : function(processor, trailing) {
    var carryValue = processor.getPSW().getBit(BITS.CARRY);
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(5).getValue()+carryValue;
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x3E
  name        : "ADDC" ,
  description : "Add R6, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  execute     : function(processor, trailing) {
    var carryValue = processor.getPSW().getBit(BITS.CARRY);
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(6).getValue()+carryValue;
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x3F
  name        : "ADDC" ,
  description : "Add R7, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  execute     : function(processor, trailing) {
    var carryValue = processor.getPSW().getBit(BITS.CARRY);
    var writeTo = processor.getA();
    var toAdd = processor.getRegister(7).getValue()+carryValue;
    processor.calculateAdditionFlags(writeTo.getValue(), toAdd);
    processor.getA().addValue(toAdd);
  }
},
{ // 0x40
  name        : "JC" ,
  description : "Jump if Carry Bit",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0x41
  name        : "AJMP" ,
  description : "Jump to Absolute Address",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0x42
  //TODO: Verify order
  name        : "ORL" ,
  description : "Logical OR Direct/Accumulator",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.A,
  execute     : function(processor, trailing) {
    var location = parseInt("0x"+trailing)
    processor.getMemory(location).logicalORByte(processor.getA())
  }
},
{ // 0x43
  name        : "ORL" ,
  description : "Logical OR Memory Location/Immediate",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {
    //TODO: Verify first byte is direct address, second is immediate
    var location = parseInt("0x"+trailing.substring(0,2))
    var immediate = parseInt("0x"+trailing.substring(2,4))
    processor.getMemory(location).logicalOR(immediate);
  }
},
{ // 0x44
  name        : "ORL" ,
  description : "Logical OR Accumulator/Immediate",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {
    var immediate = parseInt("0x"+trailing.substring(2,4))
    processor.getA().logicalOR(immediate);

  }
},
{ // 0x45
  name        : "ORL" ,
  description : "Logical OR Accumulator/Direct",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  execute     : function(processor, trailing) {
    var location = parseInt("0x"+trailing)
    processor.getA().logicalORByte(location);
  }
},
{ // 0x46
  name        : "ORL" ,
  description : "Logical OR Register 0 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  execute     : function(processor, trailing) {
    processor.getA().logicalORByte(processor.registerIndirect(0));
  }
},
{ // 0x47
  name        : "ORL" ,
  description : "Logical OR Register 1 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  execute     : function(processor, trailing) {
    processor.getA().logicalORByte(processor.registerIndirect(1));
  }
},
{ // 0x48
  name        : "ORL" ,
  description : "Logical OR R0",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  execute     : function(processor, trailing) {
    processor.getA().logicalORByte(processor.getRegister(0));
  }
},
{ // 0x49
  name        : "ORL" ,
  description : "Logical OR R1",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  execute     : function(processor, trailing) {
    processor.getA().logicalORByte(processor.getRegister(1));
  }
},
{ // 0x4A
  name        : "ORL" ,
  description : "Logical OR R2",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  execute     : function(processor, trailing) {
    processor.getA().logicalORByte(processor.getRegister(2));
  }
},
{ // 0x4B
  name        : "ORL" ,
  description : "Logical OR R3",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  execute     : function(processor, trailing) {
    processor.getA().logicalORByte(processor.getRegister(3));
  }
},
{ // 0x4C
  name        : "ORL" ,
  description : "Logical OR R4",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  execute     : function(processor, trailing) {
    processor.getA().logicalORByte(processor.getRegister(4));
  }
},
{ // 0x4D
  name        : "ORL" ,
  description : "Logical OR R5",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  execute     : function(processor, trailing) {
    processor.getA().logicalORByte(processor.getRegister(5));
  }
},
{ // 0x4E
  name        : "ORL" ,
  description : "Logical OR R6",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  execute     : function(processor, trailing) {
    processor.getA().logicalORByte(processor.getRegister(6));
  }
},
{ // 0x4F
  name        : "ORL" ,
  description : "Logical OR R7",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  execute     : function(processor, trailing) {
    processor.getA().logicalORByte(processor.getRegister(7));
  }
},
{ // 0x50
  name        : "JNC" ,
  description : "Jump if Not Carry",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0x51
  name        : "ACALL" ,
  description : "Call Absolute Address",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0x52
  name        : "ANL" ,
  description : "Logical AND, Direct/Accumulator",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.A,
  execute     : function(processor, trailing) {
    var location = parseInt("0x"+trailing);
    processor.getMemory(location).logicalANDByte(processor.getA())
  }
},
{ // 0x53
  name        : "ANL" ,
  description : "Logical AND, Direct/Immediate",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {
    var location  = parseInt("0x"+trailing.substring(0,2));
    var immediate = parseInt("0x"+trailing.substring(2,4));
    processor.getMemory(location).logicalAND(immediate);
  }
},
{ // 0x54
  name        : "ANL" ,
  description : "Logical AND, Accumulator/Immediate",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {
    var immediate = parseInt("0x"+trailing);
    processor.getA().logicalAND(immediate);
  }
},
{ // 0x55
  name        : "ANL" ,
  description : "Logical AND, Accumulator/Direct",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  execute     : function(processor, trailing) {
    var location = parseInt("0x"+trailing)
    processor.getA().logicalOR(processor.getMemory(location))
  }
},
{ // 0x56
  name        : "ANL" ,
  description : "Logical AND, Accumulator/Register 0 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  execute     : function(processor, trailing) {
    processor.getA().logicalANDByte(processor.registerIndirect(0));
  }
},
{ // 0x57
  name        : "ANL" ,
  description : "Logical AND, Accumulator/Register 1 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  execute     : function(processor, trailing) {
    processor.getA().logicalANDByte(processor.registerIndirect(1));
  }
},
{ // 0x58
  name        : "ANL" ,
  description : "Logical AND, Register 0",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  execute     : function(processor, trailing) {
    processor.getA().logicalANDByte(processor.getRegister(0));
  }
},
{ // 0x59
  name        : "ANL" ,
  description : "Logical AND, Register 1",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  execute     : function(processor, trailing) {
    processor.getA().logicalANDByte(processor.getRegister(1));
  }
},
{ // 0x5A
  name        : "ANL" ,
  description : "Logical AND, Register 2",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  execute     : function(processor, trailing) {
    processor.getA().logicalANDByte(processor.getRegister(2))
  }
},
{ // 0x5B
  name        : "ANL" ,
  description : "Logical AND, Register 3",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  execute     : function(processor, trailing) {
    processor.getA().logicalANDByte(processor.getRegister(3))
  }
},
{ // 0x5C
  name        : "ANL" ,
  description : "Logical AND, Register 4",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  execute     : function(processor, trailing) {
    processor.getA().logicalANDByte(processor.getRegister(4))
  }
},
{ // 0x5D
  name        : "ANL" ,
  description : "Logical AND, Register 5",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  execute     : function(processor, trailing) {
    processor.getA().logicalANDByte(processor.getRegister(5))
  }
},
{ // 0x5E
  name        : "ANL" ,
  description : "Logical AND, Register 6",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  execute     : function(processor, trailing) {
    processor.getA().logicalANDByte(processor.getRegister(6))
  }
},
{ // 0x5F
  name        : "ANL" ,
  description : "Logical AND, Register 7",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  execute     : function(processor, trailing) {
    processor.getA().logicalANDByte(processor.getRegister(7))
  }
},
{ // 0x60
  name        : "JZ" ,
  description : "Jump if Zero",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0x61
  name        : "AJMP" ,
  description : "Absolute Jump",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0x62
  name        : "XRL" ,
  description : "Logical XOR, Direct/Accumulator",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0x63
  name        : "XRL" ,
  description : "Logical XOR, Direct/Immediate",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x64
  name        : "XRL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x65
  name        : "XRL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0x66
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  execute     : function(processor, trailing) {

  }
},
{ // 0x67
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  execute     : function(processor, trailing) {

  }
},
{ // 0x68
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  execute     : function(processor, trailing) {

  }
},
{ // 0x69
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  execute     : function(processor, trailing) {

  }
},
{ // 0x6A
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  execute     : function(processor, trailing) {

  }
},
{ // 0x6B
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  execute     : function(processor, trailing) {

  }
},
{ // 0x6C
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  execute     : function(processor, trailing) {

  }
},
{ // 0x6D
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  execute     : function(processor, trailing) {

  }
},
{ // 0x6E
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  execute     : function(processor, trailing) {

  }
},
{ // 0x6F
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  execute     : function(processor, trailing) {

  }
},
{ // 0x70
  name        : "JNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0x71
  name        : "ACALL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0x72
  name        : "ORL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C | MODE.BIT,
  execute     : function(processor, trailing) {

  }
},
{ // 0x73
  name        : "JMP" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTADPTR,
  execute     : function(processor, trailing) {

  }
},
{ // 0x74
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x75
  name        : "MOV" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x76
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0 | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x77
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1 | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x78
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0 | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x79
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1 | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x7A
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2 | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x7B
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3 | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x7C
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4 | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x7D
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5 | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x7E
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6 | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x7F
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7 | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x80
  name        : "SJMP" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0x81
  name        : "AJMP" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0x82
  name        : "ANL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C | MODE.BIT,
  execute     : function(processor, trailing) {

  }
},
{ // 0x83
  name        : "MOVC" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.AINDIRECTPC,
  execute     : function(processor, trailing) {

  }
},
{ // 0x84
  name        : "DIV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.AB,
  execute     : function(processor, trailing) {

  }
},
{ // 0x85
  name        : "MOV" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0x86
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.INDIRECTR0,
  execute     : function(processor, trailing) {

  }
},
{ // 0x87
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.INDIRECTR1,
  execute     : function(processor, trailing) {

  }
},
{ // 0x88
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R0,
  execute     : function(processor, trailing) {

  }
},
{ // 0x89
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R1,
  execute     : function(processor, trailing) {

  }
},
{ // 0x8A
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R2,
  execute     : function(processor, trailing) {

  }
},
{ // 0x8B
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R3,
  execute     : function(processor, trailing) {

  }
},
{ // 0x8C
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R4,
  execute     : function(processor, trailing) {

  }
},
{ // 0x8D
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R5,
  execute     : function(processor, trailing) {

  }
},
{ // 0x8E
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R6,
  execute     : function(processor, trailing) {

  }
},
{ // 0x8F
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R7,
  execute     : function(processor, trailing) {

  }
},
{ // 0x90
  name        : "MOV" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DPTR | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x91
  name        : "ACALL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0x92
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT | MODE.CARRY,
  execute     : function(processor, trailing) {

  }
},
{ // 0x93
  name        : "MOVC" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.AINDIRECTPC,
  execute     : function(processor, trailing) {

  }
},
{ // 0x94
  name        : "SUBB" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  execute     : function(processor, trailing) {

  }
},
{ // 0x95
  name        : "SUBB" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0x96
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  execute     : function(processor, trailing) {

  }
},
{ // 0x97
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  execute     : function(processor, trailing) {

  }
},
{ // 0x98
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  execute     : function(processor, trailing) {

  }
},
{ // 0x99
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  execute     : function(processor, trailing) {

  }
},
{ // 0x9A
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  execute     : function(processor, trailing) {

  }
},
{ // 0x9B
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  execute     : function(processor, trailing) {

  }
},
{ // 0x9C
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  execute     : function(processor, trailing) {

  }
},
{ // 0x9D
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  execute     : function(processor, trailing) {

  }
},
{ // 0x9E
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  execute     : function(processor, trailing) {

  }
},
{ // 0x9F
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  execute     : function(processor, trailing) {

  }
},
{ // 0xA0
  name        : "ORL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C | MODE.BIT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xA1
  name        : "AJMP" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0xA2
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C | MODE.BIT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xA3
  name        : "INC" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DPTR,
  execute     : function(processor, trailing) {

  }
},
{ // 0xA4
  name        : "MUL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.AB,
  execute     : function(processor, trailing) {

  }
},
{ // 0xA5
  name        : "undefined" ,
  description : "",
  bytes       : 0,
  cycles      : 0, // TODO: get cycles
  operands    : MODE.NONE,
  execute     : function(processor, trailing) {

  }
},
{ // 0xA6
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0 | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xA7
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1 | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xA8
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0 | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xA9
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1 | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xAA
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2 | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xAB
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3 | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xAC
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4 | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xAD
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5 | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xAE
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6 | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xAF
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7 | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xB0
  name        : "ANL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C | MODE.BIT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xB1
  name        : "ACALL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0xB2
  name        : "CPL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xB3
  name        : "CPL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C,
  execute     : function(processor, trailing) {

  }
},
{ // 0xB4
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xB5
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xB6
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0 | MODE.IMMEDIATE | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xB7
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1 | MODE.IMMEDIATE | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xB8
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0 | MODE.IMMEDIATE | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xB9
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1 | MODE.IMMEDIATE | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xBA
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2 | MODE.IMMEDIATE | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xBB
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3 | MODE.IMMEDIATE | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xBC
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4 | MODE.IMMEDIATE | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xBD
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5 | MODE.IMMEDIATE | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xBE
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6 | MODE.IMMEDIATE | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xBF
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7 | MODE.IMMEDIATE | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xC0
  name        : "PUSH" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xC1
  name        : "AJMP" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0xC2
  name        : "CLR" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xC3
  name        : "CLR" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C,
  execute     : function(processor, trailing) {

  }
},
{ // 0xC4
  name        : "SWAP" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xC5
  name        : "XCH" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xC6
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  execute     : function(processor, trailing) {

  }
},
{ // 0xC7
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  execute     : function(processor, trailing) {

  }
},
{ // 0xC8
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  execute     : function(processor, trailing) {

  }
},
{ // 0xC9
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  execute     : function(processor, trailing) {

  }
},
{ // 0xCA
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  execute     : function(processor, trailing) {

  }
},
{ // 0xCB
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  execute     : function(processor, trailing) {

  }
},
{ // 0xCC
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  execute     : function(processor, trailing) {

  }
},
{ // 0xCD
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  execute     : function(processor, trailing) {

  }
},
{ // 0xCE
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  execute     : function(processor, trailing) {

  }
},
{ // 0xCF
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  execute     : function(processor, trailing) {

  }
},
{ // 0xD0
  name        : "POP" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xD1
  name        : "ACALL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0xD2
  name        : "SETB" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xD3
  name        : "SETB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C,
  execute     : function(processor, trailing) {

  }
},
{ // 0xD4
  name        : "DA" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xD5
  name        : "DJNZ" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xD6
  name        : "XCHD" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  execute     : function(processor, trailing) {

  }
},
{ // 0xD7
  name        : "XCHD" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  execute     : function(processor, trailing) {

  }
},
{ // 0xD8
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0 | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xD9
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1 | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xDA
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2 | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xDB
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3 | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xDC
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4 | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xDD
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5 | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xDE
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6 | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xDF
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7 | MODE.OFFSET,
  execute     : function(processor, trailing) {

  }
},
{ // 0xE0
  name        : "MOVX" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DPTR,
  execute     : function(processor, trailing) {

  }
},
{ // 0xE1
  name        : "AJMP" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0xE2
  name        : "MOVX" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  execute     : function(processor, trailing) {

  }
},
{ // 0xE3
  name        : "MOVX" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  execute     : function(processor, trailing) {

  }
},
{ // 0xE4
  name        : "CLR" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xE5
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  execute     : function(processor, trailing) {

  }
},
{ // 0xE6
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  execute     : function(processor, trailing) {

  }
},
{ // 0xE7
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  execute     : function(processor, trailing) {

  }
},
{ // 0xE8
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  execute     : function(processor, trailing) {

  }
},
{ // 0xE9
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  execute     : function(processor, trailing) {

  }
},
{ // 0xEA
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  execute     : function(processor, trailing) {

  }
},
{ // 0xEB
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  execute     : function(processor, trailing) {

  }
},
{ // 0xEC
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  execute     : function(processor, trailing) {

  }
},
{ // 0xED
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  execute     : function(processor, trailing) {

  }
},
{ // 0xEE
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  execute     : function(processor, trailing) {

  }
},
{ // 0xEF
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  execute     : function(processor, trailing) {

  }
},
{ // 0xF0
  name        : "MOVX" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DPTR | MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xF1
  name        : "ACALL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  execute     : function(processor, trailing) {

  }
},
{ // 0xF2
  name        : "MOVX" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0 | MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xF3
  name        : "MOVX" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1 | MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xF4
  name        : "CPL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xF5
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xF6
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0| MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xF7
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1| MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xF8
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0| MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xF9
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1| MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xFA
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2| MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xFB
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3| MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xFC
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4| MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xFD
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5| MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xFE
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6| MODE.A,
  execute     : function(processor, trailing) {

  }
},
{ // 0xFF
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7| MODE.A,
  execute     : function(processor, trailing) {

  }
}
]

/**
 * Byte "Register"
 * @param {int} value initial value of register
 */
Byte = function(value) {
  this.onChange = [];
  this.setValue(value);
}
Byte.prototype._name = "Byte";
Byte.prototype.setName = function(name) {
  this._name = name;
  return this;
}
Byte.prototype.getName = function() {
  return this._name;
}
Byte.prototype.getValue = function() {
  return this._value;
}
Byte.prototype.setValue = function(value) {
  var oldValue = this._value;
  this._value = Math.floor(value % 256);
  if(oldValue!=this._value)
    this.onValueChanged();
  return this;
}
Byte.prototype.copyValue = function(other) {
  this.setValue(other.getValue())
}
Byte.prototype.getBit = function(bitNum) {
  if(bitNum > 7) throw "Error: Invalid bit position";
  return (this.getValue() >> bitNum) & 1;
}

Byte.prototype.setBit = function(bitNum) {
  if(bitNum > 7) throw "Error: Invalid bit position";
  return this.setValue(this.getValue() | (1 << bitNum));
}
Byte.prototype.writeBit = function(bitNum, value) {
  if(bitNum > 7) throw "Error: Invalid bit position";
  if(value != 1 && value != 0) throw "invalid bit!"
  // first clear the bit
  var base = this.getValue() & ~(1 << bitNum);
  // then, or the desired value
  return this.setValue(base | (value << bitNum));
}

Byte.prototype.clearBit = function(bitNum) {
  if(bitNum > 7) throw "Error: Invalid bit position";
  return this.setValue(this.getValue() & (0xFF &= ~(1 << bitNum)));
}
Byte.prototype.toggleBit = function(bitNum) {
  if(bitNum > 7) throw "Error: Invalid bit position";
  return this.setValue(this.getValue() ^ (1 << bitNum))
}
Byte.prototype.addByte = function(other) {
  if(isNaN(other))
    return this.setValue(this.getValue() + other.getValue());
}
Byte.prototype.add = function(value) {
    return this.setValue(this.getValue() + value);
}
Byte.prototype.increment = function() {
    return this.add(1);
}
Byte.prototype.decrement = function() {
    return this.subtract(1);
}
Byte.prototype.subtractByte = function(other) {
  return this.setValue(this.getValue() - other.getValue());
}
Byte.prototype.subtract = function(value) {
    return this.setValue(this.getValue() - value);
}
Byte.logicalORByte = function(other) {
    return this.setValue(this.getValue() | other.getValue())
}
Byte.logicalOR = function(value) {
    return this.setValue(this.getValue() | value)
}
Byte.logicalANDByte = function(other) {
    return this.setValue(this.getValue() & other.getValue())
}
Byte.logicalAND = function(value) {
    return this.setValue(this.getValue() & value)
}
Byte.logicalXORByte = function(other) {
    return this.setValue(this.getValue() ^ other.getValue())
}
Byte.logicalXOR = function(value) {
    return this.setValue(this.getValue() ^ value)
}

Byte.prototype.multiplyBytes = function(other) {
  var mulVal = this.getValue() * other.getValue();
  other.setValue(mulVal/256)
  return this.setValue(mulVal % 256);
}
Byte.prototype.divideBytes = function(other) {
  var divVal = this.getValue() / other.getValue();
  other.setValue(this.getValue()%other.getValue())
  return this.setValue(divVal);
}
Byte.prototype.exchangeBytes = function(other) {
  var otherVal = other.getValue();
  other.setValue(this.getValue());
  return this.setValue(otherVal)
}
Byte.prototype.rotateLeft = function() {
    this.setValue(this.getBit(7)|this.getValue()<<1)
}
Byte.prototype.rotateRight = function() {
    this.setValue(this.getBit(0)<<7|this.getValue()>>1)
}
Byte.prototype.shiftLeft = function() {
    this.setValue(this.getValue()<<1);
}
Byte.prototype.shiftRight = function() {
    this.setValue(this.getValue()>>1);
}
Byte.prototype.onValueChanged = function() {
  for(var i = 0; i < this.onChange.length; i++)
    this.onChange[i]();
  if(this._name != "Byte")
  log("Memory["+ this._name+"] \t= "+this.getValue())
}

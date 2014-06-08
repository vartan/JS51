/**
 * 8051 Emulator
 */
function JS51() {
   this.defineRegisters();
   this._ROM = new Array(0);
   this._memory = new Array(256);
   for(var i=0; i < this.memory.length; i++) {
      this._memory[i] = 0;
   }
}
/**
 * Dictionary/enum of all addressing modes
 * @type {Enum}
 */
var MODE =
{
  NONE         : 0;
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
  IMMEDIATE    : 1 << 17
}
JS51.prototype.defineRegisters = function() {

  this.CY   = 0x07;  // Carry flag
  this.AC   = 0x06;  // Auxillary Carry Flag (BCD)
  this.F0   = 0x05;  // Flag 0 (general purpose)
  this.RS1  = 0x04;  // Register Select 1
  this.RS0  = 0x03;  // Register Select 0
  this.OV   = 0x02;  // Overflow Flag
  this.UD   = 0x01;  // User Defined Flag
  this.P    = 0x00;  // Parity Flag

  this.P0   = 0x80; // Port 0
  this.SP   = 0x81; // Stack Pointer
  this.DPL  = 0x82; // Data pointer low
  this.DPH  = 0x83; // Data Pointer High
  this.PCON = 0x87; // Power Control
  this.TCON = 0x88; // Timer Control
  this.TMOD = 0x89; // Timer Mode
  this.TL0  = 0x8A; // Timer 0: Low Byte
  this.TL1  = 0x8B; // Timer 1: Low Byte
  this.TH0  = 0x8C; // Timer 0: High Byte
  this.TH1  = 0x8D; // Timer 1: High Byte
  this.P1   = 0x90; // Port 1
  this.SCON = 0x98; // Serial Configuration
  this.SBUF = 0x99; // Serial Buffer
  this.P2   = 0xA0; // Port 2
  this.IE   = 0xA8; // Interrupt Enable
  this.P3   = 0xB0; // Port 3
  this.IP   = 0xB8; // Interrupt Priority
  this.PSW  = 0xD0; // Program Status Word
  this.A    = 0xE0; // Accumulator
  this.B    = 0xF0; // B Register
}

JS51.prototype.getMemory = function(address) {
  switch(address) {
  default:
    return this._memory[address];
  }
}

JS51.prototype.setMemory = function(address, value) {
  switch(address) {
    default:
      this._memory[address].setValue(value);
      return;
  }
}

JS51.prototype.opcodes = [
{ // 0x0
  name        : "NOP" ,
  description : "No operation",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.NONE,
  action      : function() {

  }
},
{ // 0x1
  name        : "AJMP" ,
  description : "Absolute Jump",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0x2
  name        : "LJMP" ,
  description : "Long Jump",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR16,
  action      : function() {

  }
},
{ // 0x3
  name        : "RR" ,
  description : "Rotate Right",,
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  action      : function() {

  }
},
{ // 0x4
  name        : "INC" ,
  description : "Increment Accumulator",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  action      : function() {

  }
},
{ // 0x5
  name        : "INC" ,
  description : "Increment Memory Location",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT,
  action      : function() {

  }
},
{ // 0x6
  name        : "INC" ,
  description : "Increment Register 0 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0,
  action      : function() {

  }
},
{ // 0x7
  name        : "INC" ,
  description : "Increment Register 1 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1,
  action      : function() {

  }
},
{ // 0x8
  name        : "INC" ,
  description : "Increment R0",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0,
  action      : function() {

  }
},
{ // 0x9
  name        : "INC" ,
  description : "Increment R1",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1,
  action      : function() {

  }
},
{ // 0x0A
  name        : "INC" ,
  description : "Increment R2",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2,
  action      : function() {

  }
},
{ // 0x0B
  name        : "INC" ,
  description : "Increment R3",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3,
  action      : function() {

  }
},
{ // 0x0C
  name        : "INC" ,
  description : "Increment R4",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4,
  action      : function() {

  }
},
{ // 0x0D
  name        : "INC" ,
  description : "Increment R5",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5,
  action      : function() {

  }
},
{ // 0x0E
  name        : "INC" ,
  description : "Increment R6",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6,
  action      : function() {

  }
},
{ // 0x0F
  name        : "INC" ,
  description : "Increment R7",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7,
  action      : function() {

  }
},
{ // 0x10
  name        : "JBC" ,
  description : "Jump if Bit Set and Clear Bit",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0x11
  name        : "ACALL" ,
  description : "Call Absolute Address",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0x12
  name        : "LCALL" ,
  description : "Call Long Address",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR16,
  action      : function() {

  }
},
{ // 0x13
  name        : "RRC" ,
  description : "Rotate Right with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  action      : function() {

  }
},
{ // 0x14
  name        : "DEC" ,
  description : "Decrement Accumulator",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  action      : function() {

  }
},
{ // 0x15
  name        : "DEC" ,
  description : "Decrement Memory Location",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT,
  action      : function() {

  }
},
{ // 0x16
  name        : "DEC" ,
  description : "Decrement Register 0 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0,
  action      : function() {

  }
},
{ // 0x17
  name        : "DEC" ,
  description : "Decrement Register 1 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1,
  action      : function() {

  }
},
{ // 0x18
  name        : "DEC" ,
  description : "Decrement R0",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0,
  action      : function() {

  }
},
{ // 0x19
  name        : "DEC" ,
  description : "Decrement R1",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1,
  action      : function() {

  }
},
{ // 0x1A
  name        : "DEC" ,
  description : "Decrement R2",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2,
  action      : function() {

  }
},
{ // 0x1B
  name        : "DEC" ,
  description : "Decrement R3",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3,
  action      : function() {

  }
},
{ // 0x1C
  name        : "DEC" ,
  description : "Decrement R4",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4,
  action      : function() {

  }
},
{ // 0x1D
  name        : "DEC" ,
  description : "Decrement R5",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5,
  action      : function() {

  }
},
{ // 0x1E
  name        : "DEC" ,
  description : "Decrement R6",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6,
  action      : function() {

  }
},
{ // 0x1F
  name        : "DEC" ,
  description : "Decrement R7",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7,
  action      : function() {

  }
},
{ // 0x20
  name        : "JB" ,
  description : "Jump if Bit Set",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0x21
  name        : "AJMP" ,
  description : "Jump to Absolute Address",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0x22
  name        : "RET" ,
  description : "Return from call",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.NONE,
  action      : function() {

  }
},
{ // 0x23
  name        : "RL" ,
  description : "Rotate Left",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  action      : function() {

  }
},
{ // 0x24
  name        : "ADD" ,
  description : "Add Immediate",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x25
  name        : "ADD" ,
  description : "Add Memory Location",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0x26
  name        : "ADD" ,
  description : "Add Register 0 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  action      : function() {

  }
},
{ // 0x27
  name        : "ADD" ,
  description : "Add Register 1 Indirect",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  action      : function() {

  }
},
{ // 0x28
  name        : "ADD" ,
  description : "Add R0",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  action      : function() {

  }
},
{ // 0x29
  name        : "ADD" ,
  description : "Add R1",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  action      : function() {

  }
},
{ // 0x2A
  name        : "ADD" ,
  description : "Add R2",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  action      : function() {

  }
},
{ // 0x2B
  name        : "ADD" ,
  description : "Add R3",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  action      : function() {

  }
},
{ // 0x2C
  name        : "ADD" ,
  description : "Add R4",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  action      : function() {

  }
},
{ // 0x2D
  name        : "ADD" ,
  description : "Add R5",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  action      : function() {

  }
},
{ // 0x2E
  name        : "ADD" ,
  description : "Add R6",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  action      : function() {

  }
},
{ // 0x2F
  name        : "ADD" ,
  description : "Add R7",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  action      : function() {

  }
},
{ // 0x30
  name        : "JNB" ,
  description : "Jump if bit not set",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0x31
  name        : "ACALL" ,
  description : "Call to Absolute Address",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0x32
  name        : "RETI" ,
  description : "Return from Interrupt",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.NONE,
  action      : function() {

  }
},
{ // 0x33
  name        : "RLC" ,
  description : "Rotate Left, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  action      : function() {

  }
},
{ // 0x34
  name        : "ADDC" ,
  description : "Add Immediate, with Carry",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x35
  name        : "ADDC" ,
  description : "Add Direct, with Carry",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0x36
  name        : "ADDC" ,
  description : "Add Register 0 Indirect, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  action      : function() {

  }
},
{ // 0x37
  name        : "ADDC" ,
  description : "Add Register 1, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  action      : function() {

  }
},
{ // 0x38
  name        : "ADDC" ,
  description : "Add R0, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  action      : function() {

  }
},
{ // 0x39
  name        : "ADDC" ,
  description : "Add R1, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  action      : function() {

  }
},
{ // 0x3A
  name        : "ADDC" ,
  description : "Add R2, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  action      : function() {

  }
},
{ // 0x3B
  name        : "ADDC" ,
  description : "Add R3, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  action      : function() {

  }
},
{ // 0x3C
  name        : "ADDC" ,
  description : "Add R4, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  action      : function() {

  }
},
{ // 0x3D
  name        : "ADDC" ,
  description : "Add R5, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  action      : function() {

  }
},
{ // 0x3E
  name        : "ADDC" ,
  description : "Add R6, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  action      : function() {

  }
},
{ // 0x3F
  name        : "ADDC" ,
  description : "Add R7, with Carry",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  action      : function() {

  }
},
{ // 0x40
  name        : "JC" ,
  description : "Jump if Carry Bit",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.OFFSET,
  action      : function() {

  }
},
{ // 0x41
  name        : "AJMP" ,
  description : "Jump to Absolute Address",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0x42
  name        : "ORL" ,
  description : "Logical OR",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT, A,
  action      : function() {

  }
},
{ // 0x43
  name        : "ORL" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x44
  name        : "ORL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x45
  name        : "ORL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0x4 6
  name        : "ORL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  action      : function() {

  }
},
{ // 0x47
  name        : "ORL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  action      : function() {

  }
},
{ // 0x48
  name        : "ORL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  action      : function() {

  }
},
{ // 0x49
  name        : "ORL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  action      : function() {

  }
},
{ // 0x4A
  name        : "ORL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  action      : function() {

  }
},
{ // 0x4B
  name        : "ORL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  action      : function() {

  }
},
{ // 0x4C
  name        : "ORL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  action      : function() {

  }
},
{ // 0x4D
  name        : "ORL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  action      : function() {

  }
},
{ // 0x4E
  name        : "ORL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  action      : function() {

  }
},
{ // 0x4F
  name        : "ORL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  action      : function() {

  }
},
{ // 0x50
  name        : "JNC" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.OFFSET,
  action      : function() {

  }
},
{ // 0x51
  name        : "ACALL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0x52
  name        : "ANL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT, A,
  action      : function() {

  }
},
{ // 0x53
  name        : "ANL" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x54
  name        : "ANL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x55
  name        : "ANL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0x56
  name        : "ANL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  action      : function() {

  }
},
{ // 0x57
  name        : "ANL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  action      : function() {

  }
},
{ // 0x58
  name        : "ANL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  action      : function() {

  }
},
{ // 0x59
  name        : "ANL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  action      : function() {

  }
},
{ // 0x5A
  name        : "ANL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  action      : function() {

  }
},
{ // 0x5B
  name        : "ANL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  action      : function() {

  }
},
{ // 0x5C
  name        : "ANL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  action      : function() {

  }
},
{ // 0x5D
  name        : "ANL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  action      : function() {

  }
},
{ // 0x5E
  name        : "ANL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  action      : function() {

  }
},
{ // 0x5F
  name        : "ANL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  action      : function() {

  }
},
{ // 0x60
  name        : "JZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.OFFSET,
  action      : function() {

  }
},
{ // 0x61
  name        : "AJMP" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0x62
  name        : "XRL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT, A,
  action      : function() {

  }
},
{ // 0x63
  name        : "XRL" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x64
  name        : "XRL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x65
  name        : "XRL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0x66
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  action      : function() {

  }
},
{ // 0x67
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  action      : function() {

  }
},
{ // 0x68
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  action      : function() {

  }
},
{ // 0x69
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  action      : function() {

  }
},
{ // 0x6A
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  action      : function() {

  }
},
{ // 0x6B
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  action      : function() {

  }
},
{ // 0x6C
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  action      : function() {

  }
},
{ // 0x6D
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  action      : function() {

  }
},
{ // 0x6E
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  action      : function() {

  }
},
{ // 0x6F
  name        : "XRL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  action      : function() {

  }
},
{ // 0x70
  name        : "JNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.OFFSET,
  action      : function() {

  }
},
{ // 0x71
  name        : "ACALL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0x72
  name        : "ORL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C, BIT,
  action      : function() {

  }
},
{ // 0x73
  name        : "JMP" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.@A+DPTR,
  action      : function() {

  }
},
{ // 0x74
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x75
  name        : "MOV" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x76
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0 | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x77
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1 | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x78
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0 | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x79
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1 | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x7A
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2 | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x7B
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3 | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x7C
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4 | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x7D
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5 | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x7E
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6 | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x7F
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7 | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x80
  name        : "SJMP" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.OFFSET,
  action      : function() {

  }
},
{ // 0x81
  name        : "AJMP" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0x82
  name        : "ANL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C, BIT,
  action      : function() {

  }
},
{ // 0x83
  name        : "MOVC" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A, @A+PC,
  action      : function() {

  }
},
{ // 0x84
  name        : "DIV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.AB,
  action      : function() {

  }
},
{ // 0x85
  name        : "MOV" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0x86
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.INDIRECTR0,
  action      : function() {

  }
},
{ // 0x87
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.INDIRECTR1,
  action      : function() {

  }
},
{ // 0x88
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R0,
  action      : function() {

  }
},
{ // 0x89
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R1,
  action      : function() {

  }
},
{ // 0x8A
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R2,
  action      : function() {

  }
},
{ // 0x8B
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R3,
  action      : function() {

  }
},
{ // 0x8C
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R4,
  action      : function() {

  }
},
{ // 0x8D
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R5,
  action      : function() {

  }
},
{ // 0x8E
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R6,
  action      : function() {

  }
},
{ // 0x8F
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT| MODE.R7,
  action      : function() {

  }
},
{ // 0x90
  name        : "MOV" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DPTR | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x91
  name        : "ACALL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0x92
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT, C,
  action      : function() {

  }
},
{ // 0x93
  name        : "MOVC" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A, @A+DPTR,
  action      : function() {

  }
},
{ // 0x94
  name        : "SUBB" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE,
  action      : function() {

  }
},
{ // 0x95
  name        : "SUBB" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0x96
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  action      : function() {

  }
},
{ // 0x97
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  action      : function() {

  }
},
{ // 0x98
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  action      : function() {

  }
},
{ // 0x99
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  action      : function() {

  }
},
{ // 0x9A
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  action      : function() {

  }
},
{ // 0x9B
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  action      : function() {

  }
},
{ // 0x9C
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  action      : function() {

  }
},
{ // 0x9D
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  action      : function() {

  }
},
{ // 0x9E
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  action      : function() {

  }
},
{ // 0x9F
  name        : "SUBB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  action      : function() {

  }
},
{ // 0xA0
  name        : "ORL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C, /BIT,
  action      : function() {

  }
},
{ // 0xA1
  name        : "AJMP" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0xA2
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C, BIT,
  action      : function() {

  }
},
{ // 0xA3
  name        : "INC" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DPTR,
  action      : function() {

  }
},
{ // 0xA4
  name        : "MUL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.AB,
  action      : function() {

  }
},
{ // 0xA5
  name        : "undefined" ,
  description : "",
  bytes       : ,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.NONE,
  action      : function() {

  }
},
{ // 0xA6
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0 | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xA7
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1 | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xA8
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0 | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xA9
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1 | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xAA
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2 | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xAB
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3 | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xAC
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4 | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xAD
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5 | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xAE
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6 | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xAF
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7 | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xB0
  name        : "ANL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C, /BIT,
  action      : function() {

  }
},
{ // 0xB1
  name        : "ACALL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0xB2
  name        : "CPL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT,
  action      : function() {

  }
},
{ // 0xB3
  name        : "CPL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C,
  action      : function() {

  }
},
{ // 0xB4
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.IMMEDIATE | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xB5
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xB6
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0 | MODE.IMMEDIATE | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xB7
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1 | MODE.IMMEDIATE | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xB8
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0 | MODE.IMMEDIATE | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xB9
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1 | MODE.IMMEDIATE | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xBA
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2 | MODE.IMMEDIATE | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xBB
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3 | MODE.IMMEDIATE | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xBC
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4 | MODE.IMMEDIATE | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xBD
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5 | MODE.IMMEDIATE | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xBE
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6 | MODE.IMMEDIATE | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xBF
  name        : "CJNE" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7 | MODE.IMMEDIATE | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xC0
  name        : "PUSH" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xC1
  name        : "AJMP" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0xC2
  name        : "CLR" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT,
  action      : function() {

  }
},
{ // 0xC3
  name        : "CLR" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C,
  action      : function() {

  }
},
{ // 0xC4
  name        : "SWAP" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  action      : function() {

  }
},
{ // 0xC5
  name        : "XCH" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xC6
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  action      : function() {

  }
},
{ // 0xC7
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  action      : function() {

  }
},
{ // 0xC8
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  action      : function() {

  }
},
{ // 0xC9
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  action      : function() {

  }
},
{ // 0xCA
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  action      : function() {

  }
},
{ // 0xCB
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  action      : function() {

  }
},
{ // 0xCC
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  action      : function() {

  }
},
{ // 0xCD
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  action      : function() {

  }
},
{ // 0xCE
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  action      : function() {

  }
},
{ // 0xCF
  name        : "XCH" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  action      : function() {

  }
},
{ // 0xD0
  name        : "POP" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xD1
  name        : "ACALL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0xD2
  name        : "SETB" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.BIT,
  action      : function() {

  }
},
{ // 0xD3
  name        : "SETB" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.C,
  action      : function() {

  }
},
{ // 0xD4
  name        : "DA" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  action      : function() {

  }
},
{ // 0xD5
  name        : "DJNZ" ,
  description : "",
  bytes       : 3,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xD6
  name        : "XCHD" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  action      : function() {

  }
},
{ // 0xD7
  name        : "XCHD" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  action      : function() {

  }
},
{ // 0xD8
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0 | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xD9
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1 | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xDA
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2 | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xDB
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3 | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xDC
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4 | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xDD
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5 | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xDE
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6 | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xDF
  name        : "DJNZ" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7 | MODE.OFFSET,
  action      : function() {

  }
},
{ // 0xE0
  name        : "MOVX" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A, @DPTR,
  action      : function() {

  }
},
{ // 0xE1
  name        : "AJMP" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0xE2
  name        : "MOVX" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  action      : function() {

  }
},
{ // 0xE3
  name        : "MOVX" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  action      : function() {

  }
},
{ // 0xE4
  name        : "CLR" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  action      : function() {

  }
},
{ // 0xE5
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.DIRECT,
  action      : function() {

  }
},
{ // 0xE6
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR0,
  action      : function() {

  }
},
{ // 0xE7
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.INDIRECTR1,
  action      : function() {

  }
},
{ // 0xE8
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R0,
  action      : function() {

  }
},
{ // 0xE9
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R1,
  action      : function() {

  }
},
{ // 0xEA
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R2,
  action      : function() {

  }
},
{ // 0xEB
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R3,
  action      : function() {

  }
},
{ // 0xEC
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R4,
  action      : function() {

  }
},
{ // 0xED
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R5,
  action      : function() {

  }
},
{ // 0xEE
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R6,
  action      : function() {

  }
},
{ // 0xEF
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A | MODE.R7,
  action      : function() {

  }
},
{ // 0xF0
  name        : "MOVX" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.@DPTR, A,
  action      : function() {

  }
},
{ // 0xF1
  name        : "ACALL" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.ADDR11,
  action      : function() {

  }
},
{ // 0xF2
  name        : "MOVX" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0, A,
  action      : function() {

  }
},
{ // 0xF3
  name        : "MOVX" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1, A,
  action      : function() {

  }
},
{ // 0xF4
  name        : "CPL" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.A,
  action      : function() {

  }
},
{ // 0xF5
  name        : "MOV" ,
  description : "",
  bytes       : 2,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.DIRECT, A,
  action      : function() {

  }
},
{ // 0xF6
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR0, A,
  action      : function() {

  }
},
{ // 0xF7
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.INDIRECTR1, A,
  action      : function() {

  }
},
{ // 0xF8
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R0, A,
  action      : function() {

  }
},
{ // 0xF9
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R1, A,
  action      : function() {

  }
},
{ // 0xFA
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R2, A,
  action      : function() {

  }
},
{ // 0xFB
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R3, A,
  action      : function() {

  }
},
{ // 0xFC
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R4, A,
  action      : function() {

  }
},
{ // 0xFD
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R5, A,
  action      : function() {

  }
},
{ // 0xFE
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R6, A,
  action      : function() {

  }
},
{ // 0xFF
  name        : "MOV" ,
  description : "",
  bytes       : 1,
  cycles      : 1, // TODO: get cycles
  operands    : MODE.R7, A,
  action      : function() {

  }
}
]

/**
 * Byte "Register"
 * @param {int} value initial value of register
 */
Byte = function(value) {
  this.setValue(value);
}
Byte.prototype.getValue = function() {
  return this._value;
}
Byte.prototype.setValue = function(value) {
  this._value = Math.floor(value % 256);
  return this;
}
Byte.prototype.getBit = function(bitNum) {
  if(bitNum > 7) throw "Error: Invalid bit position";
  return (this.getValue() >> bitNum) & 1;
}

Byte.prototype.setBit = function(bitNum) {
  if(bitNum > 7) throw "Error: Invalid bit position";
  return this.setValue(this.getValue() | (1 << bitNum));
}

Byte.prototype.clearBit = function(bitNum) {
  if(bitNum > 7) throw "Error: Invalid bit position";
  return this.setValue(this.getValue() & (0xFF &= ~(1 << bitNum)));
}

Byte.prototype.toggleBit = function(bitNum) {
  if(getBit(byte, bitNum) == 1)
    return clearBit(byte, bitNum);
  else
    return setBit(byte, bitNum);
}
Byte.prototype.addByte = function(other) {
  if(isNaN(other))
    return this.setValue(this.getValue() + other.getValue());
}
Byte.prototype.subtractByte = function(other) {
  return this.setValue(this.getValue() - other.getValue());
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

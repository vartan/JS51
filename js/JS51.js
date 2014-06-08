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
  ACCUMULATOR  : 1 << 2,
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
  INDIRECTR1   : 1 << 14,
  INDIRECTR2   : 1 << 15,
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

{ // 0x00
  name : "NOP",
  bytes: 1,
  cycles:1,
  operands: MODE.NONE,
  action: function() {

  }
}

]


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

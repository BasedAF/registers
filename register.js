// var script = document.createElement('script');
// script.src = '//code.jquery.com/jquery-1.11.0.min.js';
// document.getElementsByTagName('head')[0].appendChild(script);

function RegisterMachine(n) {
    // Creates a new machine with N empty registers
    // var _machine = this;
    var _registers = [];
    for (let i = 0; i < n; i++) {
        _registers.push(0);
    }

    this.running = false;

    this.toString = function(sep) {
        sep = sep || '|';
        return '[' + _registers.toString().replace(',', sep) + ']';
    }

    this.INC = function(i) {
        // Increments the register at position I.
        // Returns NULL.
        _registers[i] += 1;
        return null;
    }
    this.DEB = function(i) {
        // Decrements the register at position I.
        // Returns TRUE iff value is already 0 when function is called.
        // A value of true indicates that the program should branch.
        if (_registers[i] == 0) {
            return true;
        } else {
            _registers[i] -= 1;
            return false;
        }
    }
    this.END = function() {
        // Terminates any program running on this machine.
        this.running = false;
        console.log(this.toString());
        return null;
    }

    this.setRegister = function(i, val) {
        // Directly sets register I to VAL.
        _registers[i] = val;
    }
    this.getRegister = function(i) {
        // Returns the value currently at register I.
        return _registers[i];
    }
    this.setValues = function(vals, offset) {
        // Sets register values to VALS, a list of values.
        var i = offset || 0;
        vals.forEach(function(val){
            _registers[i++] = val;
        });
    }     
}

function RegisterInstruction(op, reg, next, alt) {
    // OP should be all-caps operation name from ('INC', 'DEB', 'END')
    // REG specifies the register operated on
    // NEXT/ALT tell the program where to move next
    // INDEX is optional redundant param to specify this instruction's position in its program
    // this.op = type;
    // this.reg = reg || null;
    // this.next = next || null;
    // this.alt = alt || null;
    // this.index = (typeof index == "number") ? index : -1;

    this.apply = function(machine) {
        switch(op) {
            case "END":
                return machine.END();
            case "INC":
                machine.INC(reg);
                return next;
            case "DEB":
                var branch = machine.DEB(reg);
                return branch ? alt : next;
        }
    }
}

function RegisterProgram(instructions) {
    // Abstract representation of a register program
    // If INSTRUCTIONS given, they form the program
    _instructions = instructions;

    this.run = function(machine) {
        var current = 0;
        machine.running = true;
        while (typeof current == "number") {
            current = _instructions[current].apply(machine);
        }
        return current;
    }
}


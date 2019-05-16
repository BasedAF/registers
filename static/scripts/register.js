// var script = document.createElement('script');
// script.src = '//code.jquery.com/jquery-1.11.0.min.js';
// document.getElementsByTagName('head')[0].appendChild(script);

function RegisterMachine(n) {
    // Creates a new machine with N empty registers
    var _registers = [];
    for (let i = 0; i < n; i++) {
        _registers.push(0);
    }
    var _machine = {"registers": _registers};
    var _running = false;
    var _steps = 0;

    _machine.toString = function(sep) {
        sep = sep || '|';
        return '[' + _registers.toString().replace(',', sep) + ']';
    }

    _machine.INC = function(i) {
        // Increments the register at position I.
        // Returns NULL.
        _steps += 1;
        _registers[i] += 1;
        return _registers[i];
    }
    _machine.DEB = function(i) {
        // Decrements the register at position I.
        // Returns TRUE iff value is already 0 when function is called.
        // A value of true indicates that the program should branch.
        _steps += 1;
        if (_registers[i] == 0) {
            return true;
        } else {
            _registers[i] -= 1;
            return false;
        }
    }
    _machine.END = function() {
        // Terminates any program running on this machine.
        _steps += 1;
        _running = false;
        console.log(this.toString());
        return _machine;
    }

    _machine.setRegister = function(i, val) {
        // Directly sets register I to VAL.
        _registers[i] = val;
    }
    _machine.getRegister = function(i) {
        // Returns the value currently at register I.
        return _registers[i];
    }
    _machine.setValues = function(vals) {
        // Sets register values to VALS, a list of values.
        _registers = vals;
    }
    _machine.getValues = function() {
        return _registers;
    }
    _machine.clone = function() {
        var clone = RegisterMachine(n);
        clone.setValues(_registers);
        return clone;
    }
    return _machine;
}

function RegisterInstruction(op, reg, nxt, alt) {
    // OP should be all-caps operation name from ('INC', 'DEB', 'END')
    // REG specifies the register operated on
    // NXT/ALT tell the program where to move next
    var _params = (op == "END") ? {} : {"reg": reg, "nxt": nxt,};
    if (op == "DEB") {
        _params.alt = alt;
    }
    var _instruction = {"op": op, "params": _params};
    _instruction.updatePos = function (index, shift) {
        // Updates params that refer to other instructions after position shift.
        // Shift is assumed to be the number of rows removed (typically 1).
        if (op == "END") return null;
        if (_params.nxt >= index && _params.nxt < index + shift) {
            nxt = 0;
        }
        if (_nxt >= index + shift) {
            _nxt -= shift;
        }
        if (op == "DEB") {
            if (_params.alt >= index && _params.alt < index + shift) {
                _alt = 0;
            }
            if (_alt > index) {
                _alt -= shift;
            }
            return null;
        }
        return null;
    }

    _instruction.changeOp = function(op, params) {
        _instruction.op = op;
        _instruction.params = params;
        return _instruction
    }

    _instruction.apply = function(machine) {
        switch(op) {
            case "END": return machine.END();
            case "INC":
                machine.INC(reg);
                return _nxt;
            case "DEB":
                var branch = machine.DEB(reg);
                return branch ? _alt : _nxt;
        }
    }

    _instruction.displayInfo = function() {
        var info = {"op": op};
        switch(op) {
            case "END": return info;
            case "INC":
                info.reg = reg;
                info.nxt = _nxt;
                return info;
            case "DEB":
                info.alt = _alt;
                return info;
        }
    }
    // For closure.
    return _instruction;
}

function RegisterProgram(instructions) {
    // Abstract representation of a register program
    // If INSTRUCTIONS given, they form the program
    instructions = instructions || [RegisterInstruction("END"),];
    var _program = {"instructions": instructions};
    _program.len = function() {
        return _program.instructions.length - 1;
    }
    _program.displayInfo = function() {
        info = [];
        _program.instructions.forEach(function(instruction, index){
            info.push(instruction.displayInfo());
            info.index = index;
        });
        return info;
    }

    _program.addInstruction = function(instruction) {
        instruction = instruction || RegisterInstruction("END");
        _program.instructions.push(instruction);
    }
    _program.removeInstruction = function(i, n) {
        n = n || 1;
        _program.instructions.forEach(function(instruction) {
            instruction.updatePos(i, n);
        });
        return _program.instructions.slice(i, n);
    }

    _program.run = function(machine, start) {
        var current = start || 1;
        machine.running = true;
        while (typeof current == "number") {
            current = _program.instructions[current].apply(machine);
        }
        return current;
    }

    _program.lines = function() {
        var result = [];
        _program.instructions.forEach(function(instruction, index){
            result.push(ProgramLine(index, instruction));
        });
        return result;
    }
    //For closure.
    return _program;
}


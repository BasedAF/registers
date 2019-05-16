function ProgramLine(index, instruction) {
    // Manages functionality of a single line in the table.
    instruction = instruction || RegisterInstruction();
    var $line = $("#line-zero").clone(true, true).removeAttr("id").show();
    var _line = {
        "instruction": instruction,
        "tableRow": $line,
        "op": $line.find(".op-select"),
        "params": {
            "reg": $line.find(".reg"),
            "nxt": $line.find(".nxt"),
            "alt": $line.find(".alt"),
        },
        "remove": $line.find(".remove-line");
    };
    _line.op.val(instruction.op);
    _line.changeOp = function(instruction) {
        if (instruction.op == "END") {
            // No parameters for END
            $line.find(".inc, .deb").addClass("inert");
        } else {
            // All other lines specify reigister, next line
            $line.find(".inc").removeClass("inert");
        }
        if (instruction.op == "INC") {
            // INC does not branch
            $line.find(".deb").addClass("inert");
        }
        if (instruction.op == "DEB") {
            // DEB needs all three parameters
            $line.find(".deb").removeClass("inert");
        }
        return instruction;
    }
    

    _line.op.on("change", function(event){
        var val = this.value;
        var instruction = {"op": val}
        if (val == "END") {
            
        }
        _line.changeOp(instruction);
    });

    _line.number = function(n) {
        var num = $line.find(".line-num");
        if (typeof n == "number") {
            num.text(n);
        }
        return parseInt(num.text());
    }
    _line.number(index);

    //For closure.
    return _line;
}

function ProgramTable(table, program) {
    // Functional organ for table that stores data of a register machine program
    // TABLE should be an HTML table set up for register programs.
    // PROGRAM will be a RegisterProgram object
    var $table = $(table);
    program = program || RegisterProgram();
    var _table = {"program": program};
    
    
    _table.addLine = function(instruction) {
        // Create new line from INSTRUCTION (default = END)
        var line = ProgramLine($table.find(".line").length, instruction);
        // Add HTML table row to table.
        $table.append(line.tableRow);
        // Adds instruction to program flow.
        _table.program.addInstruction(instruction);
    }

    _table.removeLine = function(index) {
        var $lines = $table.find(".line");
        // Removes row at INDEX.
        $lines.eq(index).remove();
        $lines = $table.find(".line");
        // Adjusts line numbers accordingly.
        for (i = index; i < $lines.length; i++) {
            $lines.eq(i).find(".line-num").text(i);
        }
        // Updates values of index references in program.
        _program.removeInstruction(index);
    }


    function readProgram(src) {
        // Assumes SRC is a DOM element with a series of items of class "line"
        var $src = $(src);
        var instructions = [];
        $src.find(".line").each(function (index, line) {
            var op = line.find("select").value;
            var instruction;
            if (op == "END") {
                instruction = RegisterInstruction(op);
            } else {
                var reg = line.find(".reg").value;
                var next = line.find(".next").value;
                instruction = (op == "DEB") ?
                    RegisterInstruction(op, reg, next, line.find(".alt").value) :
                    RegisterInstruction(op, reg, next);
            }
            instructions.push(instruction);
        });
        return instructions;
    }
    var globalLines_ = 0;
    function addLine(container) {
        // Adds a blank line of code to the interface.
        var line = $(container).find("#line-prototype").clone(true, true).removeAttr("id");
        line.find(".line-num").text(++globalLines_);
        container.find(".program").append(line.show());
        // line.show();
    }

    $table.parent().find(".add-line").on("click", function (event) {
        event.preventDefault();
        _table.addLine();
    });
    $table.find(".remove-line").on("click", function (event) {
        event.preventDefault();
        _table.removeLine(_table.lineNumber($(this).parent().parent()));
    });
    // $table.find(".op-select").on("change", function (event) {
    //     var $line = $(this).parent().parent();
    //     _table.changeOp($line, this.value);
    // });
    // For closure.
    return _table;
}
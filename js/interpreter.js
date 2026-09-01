/* Interpret a rebound file */
try {
    document.getElementById("execute").addEventListener("click", async ()=>{
        /* Text and array variables */
        const file = document.querySelector("input[type=file]").files[0];
        const text = await file.text();
        const lines = text.split(/\r?\n/);
        let line;
        let words;
        let word;
        /* Run-time variables */
        let mode = "None";
        let vars = {};
        let workingWith = "";
        let output = "";
        for(let n1 = 0; n1 < lines.length; n1++){
            line = lines[n1];
            words = line.split(" ");
            for(let n2 = 0; n2 < words.length; n2++){
                word = words[n2];
                if(mode != "commentMode" && mode != "multiCommentMode"){
                    if(mode == "printMode"){
                        let processed_word = word
                            .replace(/\{([^{}]+)\}/g, (match, key) => {return vars[key] ?? match})
                            .replace(/\\n/g, "<br>")
                            .replace(/\\t/g, "<span style='margin-left: 4em;'></span>");
                        output += processed_word + " ";
                    }else if(mode == "varDeclareDataType"){
                    	mode = "varDeclareName" + word.title();
                    }else if(mode.startsWith() == "varDeclareName"){
                        let datatype = mode.slice("varDeclareName".length);
                        vars[word] = [datatype, null];
                    }else if(mode == "varDefineName"){
                    	try{
                    		let keys = Object.keys(vars);
                    		let num = keys.indexOf(word);
                    		workingWith = num;
                    		mode = "varDefineEquals";
                    	}catch(error){
                    		window.alert("Error!" + error.message);
                            break;
                    	}
                    }else if(mode == "varDefineEquals"){
                    	if(word != "="){
                    		window.alert("Error! Unexpected " + word + " in definition of" + Object.values(vars)[workingWith]);
                            break;
                    	}else{
                    		mode = "varDefineValue";
                    	}
                    }else if(mode == "varDefineValue"){
                        // hey future wdc can u work on dis
                    }else if(word == "//"){
                        mode = "commentMode";
                    }else if(word == "/*"){
                        mode = "multiCommentMode";
                    }else if(word == "note"){
                        mode = "printMode";
                    }else if(word == "declare"){
                    	mode = "varDeclareDatatype";
                    }else if(word == "define"){
                    	mode = "varDefineName";
                    }else if(word == " "){
                    	continue;
                    }
                }else{
                    if(word == "*/"){
                        mode = "None";
                    }
                }
            };
            /* Reset variables */
            if(mode != "multiCommentMode"){
                mode = "None";
            }
        };
        const outputbox = document.getElementById("outputBox");
        outputbox.innerHTML = output;
    });
}catch(error){
    window.alert("An error has occurred! It says: " + error.message);
}

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
        let workingWith = 0;
        let output = "";
        for(let n1 = 0; n1 < lines.length; n1++){
            line = lines[n1];
            words = line.split(" ");
            for(let n2 = 0; n2 < words.length; n2++){
                word = words[n2];
                if(mode != "commentMode" && mode != "multiCommentMode"){
                    if(mode == "printMode"){
                        let processed_word = word
                            .replace(/\{([^{}]+)\}/g, (match, key) => {return vars[key][1] ?? match})
                            .replace(/\\n/g, "<br>")
                            .replace(/\\t/g, "<span style='margin-left: 4em;'></span>");
                        output += processed_word + " ";
                    }else if(mode == "varDeclareDatatype"){
                    	mode = "varDeclareName" + word;
                    }else if(mode.startsWith("varDeclareName")){
                        let datatype = mode.slice("varDeclareName".length);
                        vars[word] = [datatype, null];
                    }else if(mode == "varDefineName"){
                    	try{
                    		let keys = Object.keys(vars);
                    		let num = keys.indexOf(word);
                    		if(num == -1){
                    			throw new Error("Error! Tried to define a non-existent variable " + word + "!")
                    		}
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
                    		mode = "varDefineValueFirstValue";
                    	}
                    }else if(mode.startsWith("varDefineValue")){
                        let currentVarValue = Object.values(vars)[workingWith];
                        let currentVarType = currentVarValue[0];
                        if(mode.endsWith("FirstValue")){
                        	if(n2 == words.length - 1){
                        		if(/^-?\d+(\.\d+)?$/.test(word)){
                        		    // Handle integer and decimal assignments
                        			if(currentVarType == "int"){
                        			    if(word.includes(".")){
                        			    	window.alert("Error! Tried to give an integer a decimal value!");
                        			    	break;
                        			    }else{
                        			    	currentVarValue[1] = parseInt(word);
                        			    }
                        			}else if(currentVarType == "float"){
                        				if(word.startsWith(".")){
                        					word = "0" + word;
                        					currentVarValue[1] = parseFloat(word);
                        				}else if(word.contains(".")){
                        					currentVarValue[1] = parseFloat(word);
                        				}else{
                        					word += ".0";
                        					currentVarValue[1] = parseFloat(word);
                        				}
                        			}else{
                        			    if(word.includes(".")){
                        				    window.alert("Error! Tried to assign a variable with type " + currentVarType + " to a decimal!");
                                        }else{
                                        	window.alert("Error! Tried to assign a variable with type " + currentVarType + " to an integer!");
                                        }
                        				break;
                        			}
                        		}else if(word.startsWith("\"") && word.endsWith("\"")){
                        			// Handle string assignments
                        			if(currentVarType == "str"){
                        				word = word.slice(1, -1);
                        				currentVarValue[1] = word;
                        			}else{
                        				window.alert("Error! Tried to assign a variable of type " + currentVarType + " to a string!");
                        				break;
                        			}
                            	}
                            }
                        }
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

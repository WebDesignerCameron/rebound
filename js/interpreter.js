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
        let val;
        let valType;
        let currentVarValue;
        let currentVarType;
        for(let n1 = 0; n1 < lines.length; n1++){
            line = lines[n1];
            words = line.split(" ");
            for(let n2 = 0; n2 < words.length; n2++){
                word = words[n2];
                if(mode != "commentMode" && mode != "multiCommentMode"){
                    if(mode == "printMode"){
                        let processed_word = word
                            .replace(/\{([^{}]+)\}/g, (match, key) => {
                         	    if (!(key in vars)) return match;                   // variable not declared
                            	const [type, value] = vars[key];
                            	if (value === null || value === undefined) return match; // not yet assigned
                            	if (type === "float" && typeof value === "number") {
                            	    return value.toFixed(1);
                            	}
                            	return String(value); // ensures booleans become "true"/"false"
                            })
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
                    		if(!(word in vars)){
                    			throw new Error("Error! Tried to define a non-existent variable " + word + "!")
                    		}
                    		workingWith = word;
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
                        currentVarValue = vars[workingWith];
                        currentVarType = currentVarValue[0];
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
                        				}else if(word.includes(".")){
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
                            	}else if(word == "true" || word == "false"){
                            		// Handle boolean assignments
                            		if(currentVarType == "bool"){
                            			currentVarValue[1] = JSON.parse(word);
                            		}else{
                            			window.alert("Error! Tried to assign a variable with type " + currentVarType + "to a boolean!");
                            			break;
                            		}
                            	}
                            }else{
                                if(/^\d+$/.test(word)){
                                	val = parseInt(word);
                                	valType = "int";
                                }else if(/^\d+$/.test(word.replace(/./g, ""))){
                                	val = parseFloat(word);
                                	valType = "float";
                                }else if(word.startsWith("\"") && word.endsWith("\"")){
                                	val = word.slice(1, -1);
                                	valType = "str";
                                }else if(word == "true" || word == "false"){
                                	val = JSON.parse(word);
                                	valType = "bool";
                                }else if(word in vars){
                                	val = vars[word][1];
                                	valType = vars[word][0];
                                }
                            	mode = "varDefineValueOperand";
                            }
                        }else if(mode.endsWith("Operand")){
                        	if(word == "+"){
                        		mode = "varDefineValueSecondAdd";
                        	}else if(word == "-"){
                        		mode = "varDefineValueSecondMinus";
                        	}else if(word == "*"){
                        		mode = "varDefineValueSecondTimes";
                        	}else if(word == "/"){
                        		mode = "varDefineValueSecondDivide";
                        	}else if(word == "%"){
                        		mode = "varDefineValueSecondModulo";
                        	}else{
                        		window.alert("Error! Invalid operator " + word + "!");
                        		break;
                        	}
                        }else if(mode.startsWith("varDefineValueSecond")){
                            if(word in vars){
                            	word = vars[word];
                            }
                        	if(mode.endsWith("Add")){
                        		switch (valType) {
                        			case "int":
                        			    currentVarValue[1] = parseInt(word) + val;
                       				    break;
                       				case "float":
                       				    currentVarValue[1] = parseFloat(word) + val;
                       				    break;
                       				case "str":
                       				    currentVarValue[1] = word.split(1, -1) + val;
                       				    break;
                       				case "bool":
                       				    currentVarValue[1] = JSON.parse(word) && val;
                       				    break;
                       				default:
                       				    window.alert("Error! Somehow something type " + valType + " showed up. Don't ask me - you are the one who wrote the code.");
                       				    break;
                        		}
                        	}else if(mode.endsWith("Minus")){
                        		switch(valType) {
                        			case "int":
                        		        currentVarValue[1] = val - parseInt(word);
                        		        break;
                        		    case "float":
                        		        currentVarValue[1] = val - parseFloat(word);
                        		        break;
                        		    case "str":
                        		        let regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
                        		        currentVarValue[1] = val.split(1, -1).replace(regex, "");
                        		        break;
                        		    case "bool":
                        		        currentVarValue[1] = val && !(JSON.parse(word));
                        		        break;
                        		    default:
                        		        window.alert("Error! Somehow something type " + valType + " showed up.");
                        		        break;
                        		}
                        	}else if(mode.endsWith("Times")){
                        		switch(valType){
                        			case "int":
                        			    currentVarValue[1] = val * parseInt(word);
                        			    break;
                        			case "float":
                        			    currentVarValue[1] = val * parseFloat(word);
                        			    break;
                        			case "str":
                        		        window.alert("Error! Tried to multiply a string!");
                        		        break;
                        		    case "bool":
                        		        currentVarValue[1] = val || JSON.parse(word);
                        		        break;
                        		    default:
                        		        window.alert("Error! Encountered something type " + valType + "!");
                        		        break;
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

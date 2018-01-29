try {
    /*-----------------------
     Start of the singletons
    -----------------------*/

    const filter_Module = (function (programSettings) {

        /*----------------
         Private variables
        -----------------*/

        const tableRows = document.querySelectorAll('#urlform table tbody tr');
        const endCharacters = /([:.?!])/g;           // specifies when a thing ends
        const remCharacters = /([|]{2})|([≥()])/g;   // specifies the stuff to take out
        const website = /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/g; // website check
        return {

            /*----------------
             Public Methods
            -----------------

            --Removes domain names from the page*/
            urlRemover: (function () {
                if (programSettings.urlRemover.functionEnabled) {
                    (runScript = function () {
                        let removeListWrap = programSettings.urlRemover.removeListWrap;
                        let id_pos = [];
                        let value = "";
                        let removeCode = "";

                        for (let tableRow of tableRows) {
                            const tags = tableRow.querySelectorAll('td ul li');
                            for (let tag of tags) {

                                setTimeout(function () {
                                    let testArray = [];
                                    const text = tag.querySelector('span').innerHTML;
                                    const state = { site: false}

                                    /* Dont test if shorter then 1*/
                                    if (text.length > 0) {

                                        // if value is negative stop
                                        value = testFunctions(text, removeListWrap, tag)

                                        if (value !== false) {
                                            // console.log(value);

                                            /* replaces the original dom items with the newly computed one*/
                                            if (programSettings.urlRemover.testColoring) {
                                                tag.style.backgroundColor = "#222";
                                                tag.style.color = "#444";
                                                tag.style.borderColor = "black";
                                            }
                                            if (!programSettings.urlRemover.clearVisibleContent) {
                                                tag.querySelector('span').innerHTML = value;
                                            }

                                            tag.querySelector('input').value = value;

                                            /*removes item from DB*/
                                            if (programSettings.urlRemover.ajaxEnabled) {
                                                let id_pos = tag.id.split("_");
                                                filter_Module.sendAjax(id_pos, value);
                                            }
                                        }
                                    }
                                }, 1000);
                            }
                        }
                    })();
                }

                function testFunctions(text, removeListWrap, tag) {

                    /*set local removelists*/
                    let shortIcons = removeListWrap.shortIcons;
                    let longIcons = removeListWrap.longIcons;
                    let words = removeListWrap.words;
                    let isBetweenDots = removeListWrap.isBetweenDots;
                    let urls = removeListWrap.urls;

                    /* create data object */
                    let returnedObject = {};
                    let testObject = {};
                    testObject.testArray = [text];
                    testObject.bool = true;

                    /* create value variable*/
                    let value = "";

                    if (text.length > 35) {
                        returnObject.bool = false;
                        testObject.bool = returnedObject.bool;
                    }

                    /* create a binary removeCode*/
                    returnedObject = testHandler(testObject, shortIcons)
                    testObject.bool = returnedObject.bool;

                    returnedObject = testHandler(testObject, longIcons)
                    testObject.bool = returnedObject.bool;

                    returnedObject = testHandler(testObject, words)
                    testObject.bool = returnedObject.bool;

                    testObject.testArray = text.split(".");
                    returnedObject = testHandler(testObject, isBetweenDots)
                    testObject.bool = returnedObject.bool;

                    returnedObject = testHandler(testObject, urls)
                    testObject.bool = returnedObject.bool;

                    testObject.testArray = text.split("@");
                    if (testObject.testArray.length > 1 && testObject.bool == true) {
                        returnedObject = testObject
                        returnObject.bool = false;
                        testObject.bool = returnedObject.bool;
                    }
                    value = "";

                    // if all other test are positive run this one
                    if (testObject.bool) {
                        let textArray = text.split("");

                        if (charactersBlacklisTest(textArray[0]) || textArray[0] == "'" ) {
                            testObject.bool = false;
                        } else {
                            value += textArray[0];
                        }

                        for (var i = 1; i < textArray.length; i++) {
                            if (charactersBlacklisTest(textArray[i]) ) {
                                testObject.bool = false;
                            } else {
                                let thischar = textArray[i];
                                value += thischar.toLowerCase();

                                if (thischar.toLowerCase() !== thischar) {
                                    testObject.bool = false;
                                }
                            }
                        }
                    }

                    /* handle end of the testfunctions*/
                    if (testObject.bool) {
                        return false;
                    } else {
                        return value;
                    }

                    /*Testing proxy*/
                    function testHandler(sendObject, removeList) {
                        if (sendObject.bool) {
                            returnObject = createBinaryRemoveCode(sendObject, removeList);
                            return returnObject;
                        } else {
                            return returnObject;
                        }
                    }

                };


                //creates a binaryCode to use later

                function createBinaryRemoveCode(object, removeList) {
                    let testArray = object.testArray;
                    let bool = object.bool;
                    let res;

                    /*Compares every string in the array against the removeList*/
                    for (var i = 0; i < testArray.length; i++) {

                        /*Compares the string against the removeList*/
                        res = (function(string, removeList) {
                            for (var i = 0; i < removeList.length; i++) {
                                if (string.toLowerCase() == removeList[i]) {
                                    return true;

                                }
                            }
                            return false;
                        })(testArray[i], removeList);

                        /*create the binarycode*/
                        if (res === true) {
                            bool = false
                        }
                    }

                    /*returns the object*/
                    object.bool = bool;
                    return (object);
                }

                function charactersBlacklisTest(char) {
                    charArray = [
                        "(",
                        ")",
                        "{",
                        "}",
                        "[",
                        "]",
                        '"',
                        "•",
                        "<",
                        ">",
                        "&gt;",
                        "&lt;",
                    ]
                    for (var i = 0; i < charArray.length; i++) {
                        if (char == charArray[i]) {
                            return true;
                        }
                    }
                    return false;
                }
            })(),

            removeUnwantedEnds: (function (rows) {
                setTimeout(function () {

                    for (var i = 0; i < rows.length; i++) {
                        let rowItems = rows[i].querySelectorAll("td ul li span");

                        // remove front   - and |
                        for (var j = 0; j < rowItems.length; j++) {
                            let currentItem = rowItems[j].innerHTML

                            if (currentItem.length < 2) {
                                removeFunction(currentItem, rowItems)
                            } else {
                                break;
                            }
                        }

                        // remove end   - and |
                        for (var j = rowItems.length-1; j > 0; j--) {
                            let currentItem = rowItems[j].innerHTML

                            if (currentItem.length < 2) {
                                removeFunction(currentItem, rowItems)
                            } else {
                                break;
                            }
                        }
                    }

                    function removeFunction(currentItem, rowItems) {
                        if (currentItem == "|" || currentItem == "-") {

                            rowItems[j].innerHTML = "";
                            let id_pos = rowItems[j].parentElement.id.split("_");
                            let value = rowItems[j].parentElement.children[1].value;
                            value = "";
                            filter_Module.sendAjax(id_pos, value);
                        }
                    }
                }, 1000);
            })(tableRows),

            removeDoubleDotsOnEnd: (function(rows) {
                setTimeout(function () {
                    for (var i = 0; i < rows.length; i++) {
                        let rowItems = rows[i].querySelectorAll("td ul li span");

                        // remove end   - and |
                        for (var j = rowItems.length-1; j > 0; j--) {
                            let currentItem = rowItems[j].innerHTML

                            if (currentItem.length > 1) {
                                removeFunction(currentItem, rowItems[j])
                                break;
                            }
                        }
                        function removeFunction(currentItemString, rowItem) {
                            if (
                                currentItemString[currentItemString.length-1] == ":" ||
                                currentItemString[currentItemString.length-1] == ";" ||
                                currentItemString[currentItemString.length-1] == ","
                            ) {

                                currentItemString = currentItemString[currentItemString.length-2]
                                rowItem.innerHTML = currentItemString;

                                let id_pos = rowItem.parentElement.id.split("_");
                                let value = currentItemString;

                                filter_Module.sendAjax(id_pos, value);
                            }
                        }
                    }
                }, 1500);
            })(tableRows),

            sendAjax: (function(id_pos, value) {
                const L_ui = document.querySelector('input.hidden').value;
                const L_id = id_pos[0];
                const L_pos = id_pos[1];
                const L_value = value;

                // alert(L_ui);
                // alert(L_id + " " + L_pos + " " + value)

                var xhr = new XMLHttpRequest();
                xhr.open("POST", 'http://51.255.87.34/~pagina/ajax/change_tag.php', true);

                //Send the proper header information along with the request
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                xhr.onreadystatechange = function() {//Call a function when the state changes.
                    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                        // Request finished. Do processing here.
                    }
                }
                xhr.send('ui=' + L_ui + "&id=" + L_id + "&pos=" + L_pos + "&value=" + L_value);
            })
        }
    })(programSettings);




} catch(err) {
    alert("pagina_maken is broken");
    console.log(err);
}
finally {
    if (programSettings.smokeTest.methodEnabled) {
        alert("No fatal error")
    }
}

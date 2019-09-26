import dataService from "./data-service.js";

class Autocomplete{
	constructor(){
		this.selectedList = [];
		this.tagList = [];
		this.inputtext = '';
		this.currentFocus='';
		this.containerElement = document.getElementsByClassName('tag-container')[0];
		this.hiddenInput = document.getElementsByClassName('hidden-tags')[0];
	    this.mainInput = document.getElementById("myInput");
	    this.autocompleteNode = document.getElementById("autocomplete-container");
	    this.selectedListViewContainer = document.getElementById("selected-list");

	    /*execute a function when someone clicks in the document:*/
	    document.addEventListener("click",  (e) => {
	        this.closeAllLists(e.target);
	    });

	    this.containerElement.addEventListener("click",() =>{
	    	this.mainInput.focus();
	    })

	}

	detectDuplicate(arr, name) {
	    if (!arr.length) {
	        return false;
	    }else{
	    	for (var i = 0; i < arr.length; i++) {
	            if (arr[i].name === name) {
	                return true;
	            }
	        }
	    }
	    return false;
	}
	
	onTagAddition = (val, idx) => {
	    let isDuplicatePresent = this.detectDuplicate(this.selectedList, dataService.getCountries()[idx].name);
	    if (isDuplicatePresent) {
	    	alert(val + " has already been added to list");
	        return;
	    }

	    let tagData = {
	        text: val,
	        element: document.createElement('span')
	    };

	    tagData.element.classList.add('tag');
	    tagData.element.textContent = tagData.text;

	    let closeBtn = document.createElement('span');
	    closeBtn.classList.add('close');
	    closeBtn.addEventListener('click',  () => {
	        this.onTagRemoval(this.tagList.indexOf(tagData));
	    });
	    tagData.element.appendChild(closeBtn);
	    this.tagList.push(tagData);
	    this.containerElement.insertBefore(tagData.element, this.mainInput);
	    this.selectedList.push(dataService.getCountries()[idx]);
	    this.updateViewContainer();
	}

	onTagRemoval = (index) => {
	    let tag = this.tagList[index];
	    this.tagList.splice(index, 1);
	    this.containerElement.removeChild(tag.element);
	    this.selectedList.splice(index, 1);
	    this.updateViewContainer();
	}

	updateViewContainer() {
	    this.selectedListViewContainer.innerHTML = this.selectedList.length ? JSON.stringify(this.selectedList) : '';
	}

	closeAllLists = (elmnt) => {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != this.mainInput) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    

	addActive = (x) => {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        this.removeActive(x);
        if (this.currentFocus >= x.length) this.currentFocus = 0;
        if (this.currentFocus < 0) this.currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[this.currentFocus].classList.add("autocomplete-active");
    }

    removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }	
	
	initAutocomplete = () => {
	    this.mainInput.addEventListener("input", (e)=> {
	        this.inputtext = e.target.value;
	        let a, b, i, val = this.inputtext;
	        this.closeAllLists();
	        if (!val) { return false; }
	        this.currentFocus = -1;

	        /*create a DIV element that will contain the items (values):*/
	        a = document.createElement("div");
	        a.setAttribute("id", "autocomplete-list");
	        a.setAttribute("class", "autocomplete-items");
	        a.style.left = (this.mainInput.getBoundingClientRect().x - 10) + 'px';
	        this.autocompleteNode.appendChild(a);
	        /*for each item in the array...*/
	        let arr =dataService.getCountries();
	        for (i = 0; i < arr.length; i++) {
	            /*check if the item starts with the same letters as the text field value:*/
	            let name = arr[i].name;
	            if (name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
	                b = document.createElement("div");
	                b.innerHTML = name;
	                b.innerHTML += "<input type='hidden' value='" + name + "'>";
	                b.setAttribute("indexer", i);
	                b.addEventListener("click", (e)=> {
	                    let val = e.target.innerText
	                    this.onTagAddition(val, e.target.getAttribute("indexer"));
	                    this.mainInput.value = '';
	                    this.closeAllLists();
	                });
	                a.appendChild(b);
	            }
	        }
	    });

	    /*execute a function presses a key on the keyboard:*/
	    this.mainInput.addEventListener("keydown", (e)=> {

	        let keyCode = e.which || e.keyCode;
	        //Handle backspace
	        if (keyCode === 8 && this.mainInput.value.length === 0 && this.tagList.length > 0) {
	            this.onTagRemoval(this.tagList.length - 1);
	        }

	        var x = document.getElementById("autocomplete-list");
	        if (x) x = x.getElementsByTagName("div");
	        if (e.keyCode == 40) {
	            /*If the arrow DOWN key is pressed,
	            increase the this.currentFocus variable:*/
	            this.currentFocus++;
	            /*and and make the current item more visible:*/
	            this.addActive(x);
	        } else if (e.keyCode == 38) { //up
	            /*If the arrow UP key is pressed,
	            decrease the this.currentFocus variable:*/
	            this.currentFocus--;
	            /*and and make the current item more visible:*/
	            this.addActive(x);
	        } else if (e.keyCode == 13) {
	            /*If the ENTER key is pressed, prevent the form from being submitted,*/
	            e.preventDefault();
	            if (this.currentFocus > -1) {
	                /*and simulate a click on the "active" item:*/
	                if (x) x[this.currentFocus].click();
	            }
	        }
	    });
	}
	
}

const autocomplete = new Autocomplete();
export default autocomplete;
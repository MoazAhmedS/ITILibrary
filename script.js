function Book(name, price, auther) {
    this.name = name;
    this.price = price;
    this.auther = auther;
}
function Auther(name, email) {
    this.name = name;
    this.email = email;
}
var books = [];

var booknumber = 0;

function inputValidation(bName, bNameE, bPrice, bPriceE, aName, aNameE, aEmail, aEmailE) {

    var isValid = true;
    function validateField(value, errorE, validateFunc) {
        var errorMessage = validateFunc(value);
        var isInput = errorE.tagName.toLowerCase() === "input";

        if (errorMessage !== true) {
            if (isInput) {
                errorE.style.border = "3px solid rgb(202, 59, 59)";
            } else {
                errorE.style.display = "block";
                errorE.innerHTML = errorMessage;
            }
            isValid = false;
        } else {
            if (isInput) {
                errorE.style.border = "0px";
            } else {
                errorE.style.display = "none";
            }
        }
    }

    validateField(bName, bNameE, validateName);
    validateField(bPrice, bPriceE, validateNumeric);
    validateField(aName, aNameE, validateName);
    validateField(aEmail, aEmailE, validateEmail);

    return isValid;
}


document.getElementById("bookNumber").addEventListener("click", function () {
    var booknumberValue = document.querySelector("#bookN input").value;
    var errorBookN = document.querySelector("#bookN p");
    if (validateNumeric(booknumberValue) !== true) {
        errorBookN.style.display = "block";
        errorBookN.innerHTML = validateNumeric(booknumberValue);
    } else {
        errorBookN.style.display = "none";
        booknumber = parseInt(booknumberValue);
        document.getElementById("bookN").style.display = "none";
        document.getElementById("bookData").style.display = "inline-block";
        document.querySelector("h4").style.display = "block";
        document.querySelector("span").innerHTML = booknumber;
    }
});

document.getElementById("addBook").addEventListener("click", function () {
    var bookName = document.querySelectorAll("#bookData input")[0].value;
    var errorBookName = document.querySelectorAll("#bookData p")[0];

    var bookPrice = document.querySelectorAll("#bookData input")[1].value;
    var errorBookPrice = document.querySelectorAll("#bookData p")[1];

    var bookAuther = document.querySelectorAll("#bookData input")[2].value;
    var errorAuther = document.querySelectorAll("#bookData p")[2];

    var bookEmail = document.querySelectorAll("#bookData input")[3].value;
    var errorEmail = document.querySelectorAll("#bookData p")[3];
    var valid = inputValidation(bookName, errorBookName, bookPrice, errorBookPrice,
        bookAuther, errorAuther, bookEmail, errorEmail);

    if (valid) {
        document.querySelector("span").innerHTML = --booknumber;
        var auther = new Auther(bookAuther, bookEmail);
        var book = new Book(bookName, bookPrice, auther);
        books.push(book);
    }
    if (booknumber === 0) {
        document.getElementById("bookData").style.display = "none";
        document.getElementById("bookTable").style.display = "inline-block";
        loodBookToTable();
    }
});

function loodBookToTable() {
    for (var i = 0; i < books.length; i++) {
        var table = document.querySelector('tbody');
        var row = table.insertRow();
        row.setAttribute("index", i);

        row.innerHTML = `
            <td>${books[i].name}</td>
            <td>${books[i].price}</td>
            <td>${books[i].auther.name}</td>
            <td>${books[i].auther.email}</td>
            <td>
                <button onclick="editBook(this)">Edit</button>
            </td>
            <td>
                <button onclick="deleteBook(this)">Delete</button>
            </td>
        `;
    }
}

function editBook(button) {
    var row = button.parentElement.parentElement;
    var cells = row.getElementsByTagName("td");
    for (var i = 0; i < 4; i++) {
        var input = document.createElement("input");
        input.type = "text";
        input.style.width = "95%";
        input.style.height = "85%";
        input.style.margin = "0px";
        input.style.padding = "0px";
        input.style.textAlign = "center";
        input.value = cells[i].innerText;
        cells[i].innerText = "";
        cells[i].append(input);
    }
    button.innerText = "Save";
    cells[5].children[0].innerText = "Cancel";
    button.setAttribute("onclick", "savebook(this)");
    cells[5].children[0].setAttribute("onclick", "cancelEdit(this)");
}


function deleteBook(button) {
    var row = button.parentElement.parentElement;
    var index = row.getAttribute("index");
    books.splice(index, 1);
    row.remove();
}

function savebook(button) {
    var row = button.parentElement.parentElement;
    var cells = row.getElementsByTagName("td");
    var index = row.getAttribute("index");

    var bookName = cells[0].children[0].value;
    var bookPrice = cells[1].children[0].value;
    var authorName = cells[2].children[0].value;
    var authorEmail = cells[3].children[0].value;
    var valid = inputValidation(bookName, cells[0].children[0], bookPrice, cells[1].children[0],
        authorName, cells[2].children[0], authorEmail, cells[3].children[0]);
    if (valid) {
        books[index].name = bookName;
        books[index].price = bookPrice;
        books[index].auther.name = authorName;
        books[index].auther.email = authorEmail;
        for (var i = 0; i < 4; i++) {
            cells[i].innerHTML = "";
        }
        cells[0].innerText = bookName;
        cells[1].innerText = bookPrice;
        cells[2].innerText = authorName;
        cells[3].innerText = authorEmail;

        button.innerText = "Edit";
        cells[5].children[0].innerText = "Delete";
        button.setAttribute("onclick", "editBook(this)");
        cells[5].children[0].setAttribute("onclick", "deleteBook(this)");
    }
}

function cancelEdit(button) {
    var row = button.parentElement.parentElement;
    var cells = row.getElementsByTagName("td");
    var index = row.getAttribute("index");

    for (var i = 0; i < 4; i++) {
        cells[i].innerHTML = "";
    }

    cells[0].innerText = books[index].name;
    cells[1].innerText = books[index].price;
    cells[2].innerText = books[index].auther.name;
    cells[3].innerText = books[index].auther.email;

    button.innerText = "Delete";
    cells[4].children[0].innerText = "Edit";
    button.setAttribute("onclick", "deleteBook(this)");
    cells[4].children[0].setAttribute("onclick", "editBook(this)");
}

function validateEmail(email) {
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email.trim() === "") return "*Value Can't be Empty!";
    return regex.test(email) ? true : "*Invalid email format";
}

function validateName(name) {
    var regex = /^[a-zA-Z ]+$/;

    if (name.trim() === "") return "*Value Can't be Empty!";
    return regex.test(name) ? true : "*Name can only contain letters";
}

function validateNumeric(value) {
    var regex = /^[0-9]+$/;

    if (value.trim() === "") return "*Value Can't be Empty!";
    return regex.test(value) ? true : "*Only numeric values are allowed";
}
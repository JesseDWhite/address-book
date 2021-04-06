function Contact(firstName, lastName, phoneNumber, emailAddress, homeAddress, workAddress) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.emailAddress = emailAddress;
    this.additionalAddresses = {}
}

Contact.prototype.fullName = function () {
    return this.firstName + " " + this.lastName;
}

Contact.prototype.addAdditionalAddresses = function (address1, address2) {
    this.additionalAddresses.homeAddress = address1;
    this.additionalAddresses.workAddress = address2;
}

function AddressBook() {
    this.contacts = {};
    this.currentId = 0;
}

AddressBook.prototype.addContact = function (contact) {
    contact.id = this.assignId();
    this.contacts[contact.id] = contact;
}

AddressBook.prototype.assignId = function () {
    this.currentId += 1;
    return this.currentId;
}

AddressBook.prototype.findContact = function (id) {
    if (this.contacts[id] != undefined) {
        return this.contacts[id];
    }
    return false;
}

AddressBook.prototype.deleteContact = function (id) {
    if (this.contacts[id] === undefined) {
        return false;
    }
    delete this.contacts[id];
    return true;
}

let addressBook = new AddressBook();

function displayContactDetails(addressBookToDisplay) {
    let contactsList = $("ul#contacts");
    let htmlForContactInfo = "";
    Object.keys(addressBookToDisplay.contacts).forEach(function (key) {
        const contact = addressBookToDisplay.findContact(key);
        htmlForContactInfo += "<li id=" + contact.id + ">" + contact.fullName() + "</li>";
    })
    contactsList.html(htmlForContactInfo);
};

function showContact(contactId) {
    const contact = addressBook.findContact(contactId);
    $("#show-contact").show();
    $(".first-name").html(contact.firstName);
    $(".last-name").html(contact.lastName);
    $(".phone-number").html(contact.phoneNumber);
    $(".email-address").html(contact.emailAddress);
    $("#home-address").html(contact.additionalAddresses.homeAddress);
    $("#work-address").html(contact.additionalAddresses.workAddress);
    let buttons = $("#buttons");
    buttons.empty();
    buttons.append("<button class='deleteButton btn btn-danger' id=" + + contact.id + ">Delete</button>");
}

function attachContactListeners() {
    $("ul#contacts").on("click", "li", function () {
        showContact(this.id);
    });
    $("#buttons").on("click", ".deleteButton", function () {
        addressBook.deleteContact(this.id);
        $("#show-contact").hide();
        displayContactDetails(addressBook);
    });
};

$(document).ready(function () {
    attachContactListeners();
    $("form#new-contact").submit(function (event) {
        event.preventDefault()
        const inputtedFirstName = $("input#new-first-name").val();
        const inputtedLastName = $("input#new-last-name").val();
        const inputtedPhoneNumber = $("input#new-phone-number").val();
        const inputtedEmail = $("input#new-email-address").val();
        const inputtedHomeAddress = $("input#new-home-address").val();
        const inputtedWorkAddress = $("input#new-work-address").val();

        $("input#new-first-name").val("");
        $("input#new-last-name").val("");
        $("input#new-phone-number").val("");
        $("input#new-email-address").val("");
        $("input#new-home-address").val("");
        $("input#new-work-address").val("");

        let newContact = new Contact(inputtedFirstName, inputtedLastName, inputtedPhoneNumber, inputtedEmail, inputtedHomeAddress, inputtedWorkAddress);
        addressBook.addContact(newContact);

        if (inputtedHomeAddress || inputtedWorkAddress) {
            newContact.addAdditionalAddresses(inputtedHomeAddress, inputtedWorkAddress);
            $("#home-address").show(newContact.addAdditionalAddresses.inputtedHomeAddress);
            $("#work-address").show(newContact.addAdditionalAddresses.inputtedWorkAddress);
        } else if (inputtedHomeAddress) {
            newContact.addAdditionalAddresses(inputtedHomeAddress);
            $("#home-address").show(newContact.addAdditionalAddresses.inputtedHomeAddress);
        } else if (inputtedWorkAddress) {
            newContact.addAdditionalAddresses(inputtedWorkAddress);
            $("#work-address").show(newContact.addAdditionalAddresses.inputtedWorkAddress);
        }

        displayContactDetails(addressBook);
    })
})
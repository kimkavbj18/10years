function openTabsPrices(evt, sectionName) {
    // Declare all variables
    var i, tabcontentPrices, tablinksPrices;

    // Get all elements with class="tabcontent" and hide them
    tabcontentPrices = document.getElementsByClassName("tabcontentPrices");
    for (i = 0; i < tabcontentPrices.length; i++) {
        tabcontentPrices[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinksPrices = document.getElementsByClassName("tablinksPrices");
    for (i = 0; i < tablinksPrices.length; i++) {
        tablinksPrices[i].className = tablinksPrices[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(sectionName).style.display = "block";
    evt.currentTarget.className += " active";
}
function openTabsSO(evt, sectionName) {
    // Declare all variables
    var i, tabcontentSO, tablinksSO;

    // Get all elements with class="tabcontent" and hide them
    tabcontentSO = document.getElementsByClassName("tabcontentSO");
    for (i = 0; i < tabcontentSO.length; i++) {
        tabcontentSO[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinksSO = document.getElementsByClassName("tablinksSO");
    for (i = 0; i < tablinksSO.length; i++) {
        tablinksSO[i].className = tablinksSO[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(sectionName).style.display = "block";
    evt.currentTarget.className += " active";
}
// function openTabsInstance(evt, sectionName) {
//     // Declare all variables
//     var i, tabcontentInstance, tablinksInstance;
//
//     // Get all elements with class="tabcontent" and hide them
//     tabcontentInstance = document.getElementsByClassName("tabcontentInstance");
//     for (i = 0; i < tabcontentInstance.length; i++) {
//         tabcontentInstance[i].style.display = "none";
//     }
//
//     // Get all elements with class="tablinks" and remove the class "active"
//     tablinksInstance = document.getElementsByClassName("tablinksInstance");
//     for (i = 0; i < tablinksInstance.length; i++) {
//         tablinksInstance[i].className = tablinksInstance[i].className.replace(" active", "");
//     }
//
//     // Show the current tab, and add an "active" class to the button that opened the tab
//     document.getElementById(sectionName).style.display = "block";
//     evt.currentTarget.className += " active";
// }
// Set the date we're counting down to
var countDownDate = new Date("Dec 14, 2018 00:00:00").getTime();
var countDownDate2 = new Date("Jan 30, 2019 00:00:00").getTime();

// Update the count down every 1 second
var countDown = document.getElementById("countdown") || '';
var countDown2 = document.getElementById("countdown2") || '';

if ( countDown !== '') {
    var x = setInterval(function() {

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="countdown"
        countDown.innerHTML = days + " Días y " + hours + " Horas";

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "Finalizado";
        }
    }, 1000);
}

if ( countDown2 !== '') {
    var y = setInterval(function() {

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate2 - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="countdown"
    
        countDown2.innerHTML = days + " Días y " + hours + " Horas";

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(y);
            document.getElementById("countdown2").innerHTML = "Finalizado";
        }
    }, 1000);
}

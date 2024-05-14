function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        document.getElementById("error").innerHTML = "Geolocation is not supported by this browser.";
    }
  
    function showPosition(position) {
        var i = position.coords.latitude;
        var j = position.coords.longitude;
        document.getElementById("lat").value = i;
        document.getElementById("lon").value = j;

        // Weather API call and data processing
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?lat=" + i + "&lon=" + j + "&APPID=your api key",
            success: function(res) {
                var weatherType = res.weather[0].main.toLowerCase();
                switch (weatherType) {
                    case "mist":
                        document.getElementById("weather").value = 7;
                        break;
                    case "clear":
                        document.getElementById("weather").value = 1;
                        document.getElementById("roadsc").value = 1;
                        break;
                    case "rain":
                        document.getElementById("weather").value = 2;
                        document.getElementById("roadsc").value = 2;
                        break;
                    case "snow":
                        document.getElementById("weather").value = 3;
                        document.getElementById("roadsc").value = 3;
                        break;
                    case "clouds":
                        document.getElementById("weather").value = 4;
                        document.getElementById("roadsc").value = 7;
                        break;
                    default:
                        break;
                }
                
                var d = new Date();
                var n = d.getHours();
                if (n >= 19 || n <= 6)
                    document.getElementById("light").value = 4;
                else
                    document.getElementById("light").value = 1;

                var d = d.getDay();
                document.getElementById("day").value = d + 1;

                // Post data after processing weather
                postData();
            }
        });
    }
}

function postData() {
    $.post(
        '/',
        {
            Did_Police_Officer_Attend: $('#Did_Police_Officer_Attend').val(),
            age_of_driver: Math.log(parseInt($('#age_of_driver').val())),
            vehicle_type: $('#vehicle_type').val(),
            age_of_vehicle: Math.log(parseInt($('#age_of_vehicle').val())),
            engine_cc: $('#engine_cc').val(),
            day: $('#day').val(),
            weather: $('#weather').val(),
            light: $('#light').val(),
            roadsc: $('#roadsc').val(),
            gender: $('#gender').val(),
            speedl: $('#speedl').val()
        },
        function(data) {
            $('#result').html(data);
            console.log(data);
        }
    );
}

$(document).ready(function() {
    getLocation(); // Call getLocation when the page loads

    // Add event listeners to input elements
    $('#Did_Police_Officer_Attend, #age_of_driver, #vehicle_type, #age_of_vehicle, #engine_cc, #speedl').on('change', function() {
        postData(); // Trigger postData when any of the input values change
    });

    // Add event listener to submit button
    $('#submitBtn').on('click', function(e) {
        e.preventDefault();
        var randomNumber = Math.floor(Math.random() * 3) + 1;
        $('#result').html(randomNumber);
        console.log($('#gender').val());
    });
});

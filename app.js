const app = Vue.createApp({
    data() {
        return {
            locationInput: '',
            locationResults: '',
            timeResults: '',
            showResults: false,
            showEmailForm: false,
            emailInput: '',
            email: '',
            emailSentSuccess: true,
            showEmailDeliveryStatus: false,
            dstActive: false,
        }
    },
    created() {
        this.location = 'Morristown, New Jersey'
        this.time = '6:55:02 - 7:55:02 PM'
    },
    methods: {
        submitLocationInput(e) {
            e.preventDefault()

            if (!this.locationInput) {
                alert("Please enter an Address, City or Post/Zip code")
                return
            }

            const inputLocation = {
                location: this.locationInput,
                method: "input"
            }

            fetch("http://localhost:5000/api/"
                ,
                {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(inputLocation)
                }
            )
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.status == "ok") {
                        this.locationResults = data.location
                        this.timeResults = data.time
                        this.dstActive = data.dstActive
                        this.showResults = true
                    } else if (data.status == "error") {
                        const geoErr = document.querySelector('.get-location-error')
                        geoErr.innerHTML = data.errorMessage
                    }

                })
                .catch((err) => {
                    console.log(err);
                });

            this.locationInput = ''
        },
        getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const locateMePostData = {
                        geoLat: position.coords.latitude,
                        geoLon: position.coords.longitude,
                        method: "locate"
                    }
                    this.submitGeoLocation(locateMePostData)
                }, this.showGetLocationError);
            } else {
                alert('Location service is not supported in your browser');
            }
        },
        submitGeoLocation(data) {
            fetch("http://localhost:5000/api"
                ,
                {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            )
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.status == "ok") {
                        this.locationResults = data.location
                        this.timeResults = data.time
                        this.dstActive = data.dstActive
                        this.showResults = true
                    } else if (data.status == "error") {
                        const geoErr = document.querySelector('.get-location-error')
                        geoErr.innerHTML = data.errorMessage
                    }

                })
                .catch((err) => {
                    console.log(err);
                });
        },
        showGetLocationError(error) {
            const geoErr = document.querySelector('.get-location-error')
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    geoErr.innerHTML = "User denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    geoErr.innerHTML = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    geoErr.innerHTML = "The request to get user location timed out.";
                    break;
                case error.UNKNOWN_ERROR:
                    geoErr.innerHTML = "An unknown error occurred.";
                    break;
            }
        },
        openEmailForm() {
            this.showEmailForm = true
        },
        submitEmailForm(e) {
            e.preventDefault()

            if (!this.emailInput) {
                alert("Please enter an email address")
                return
            }

            const inputEmail = {
                time: this.time,
                location: this.location,
                dstActive: this.dstActive,
                email: this.emailInput
            }

            fetch("http://localhost:5000/api/"
                ,
                {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(inputEmail)
                }
            )
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    this.showEmailDeliveryStatus = true
                    this.emailSentSuccess = data.success
                    this.email = data.email
                })
                .catch((err) => {
                    console.log(err);
                });

            this.emailInput = ''

        }
    }
})

app.mount('#app')
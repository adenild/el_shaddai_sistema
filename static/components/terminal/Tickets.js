let app = new Vue({
    el: '#tickets',
    data: function () {
        return {
            form: {
                travel: {
                    id: null,
                    text: null,
                    price: null,
                },
                change_price: 100,
                passenger_name: null,
                passenger_birthday: null,
                passenger_cpf: null,
                passenger_id: null,
                payment_method: null,
                total_price: null
            },
            booleans: {
                failed: null
            },
            travels: {},
            routes: {},
            discounts: [
                {"type": "Idoso", "value": 80},
                {"type": "Idoso acompanhado", "value": 60},
                {"type": "Gestante", "value": 50},
                {"type": "Gestante acompanhada", "value": 30},
                {"type": "CAD Único", "value": 70}
            ]
        }
    },
    methods: {
        cleanForm: function () {
            let scope = this;
            scope.form = {
                travel: {
                    id: null,
                    text: null,
                    price: null,
                },
                change_price: 100,
                passenger_name: null,
                passenger_birthday: null,
                passenger_cpf: null,
                passenger_id: null,
                payment_method: null,
                total_price: null
            }
        },

        getCookie: function (name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                let cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    let cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        },
        getTravels: async function (){
            let scope = this;
            let response = await $.ajax({
                method: "GET",
                url: "/terminal/api/travel/read",
                credentials: 'include',
                headers: {'X-CSRFToken': this.getCookie("csrftoken")}
            });

            for (let key in response["data"]) {
                response["data"][key]["route"] = scope.routes[(response["data"][key]["route_id"]).toString()];
            }

            scope.travels = response["data"]
        },
        getRoute: async function () {
            let scope = this;
            let response = await $.ajax({
                method: "POST",
                url: "/terminal/api/route/read",
                credentials: 'include',
                headers: {'X-CSRFToken': this.getCookie("csrftoken")}
            });
            scope.routes = response["data"];
        },

        calculatePrice: function () {
            let scope = this;
            scope.form.total_price = (scope.form.travel.price * ((scope.form.change_price)/100)).toFixed(2);
        },

        applyDiscount: function (discountIndex) {
            let scope = this;
            scope.form.change_price = scope.discounts[discountIndex].value;
            this.calculatePrice();
        },

        fillTravel: function (travelIndex) {
            let scope = this;
            scope.form.change_price = 100;
            scope.form.travel.id = (Object.keys(scope.travels)[travelIndex-1]).toString();
            scope.form.travel.price = scope.travels[scope.form.travel.id]["base_price"];
            scope.form.travel.text = scope.travels[scope.form.travel.id]["route"]["origin"] + " - " + scope.travels[scope.form.travel.id]["route"]["destiny"]
            this.calculatePrice();
        },

        registerTicket: function () {
            let scope = this;
            const params = scope.form;
            $.ajax({
                method: "POST",
                url: "/terminal/api/ticket/create",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")}
            }).then(response => this.cleanForm()).catch(error => scope.booleans.failed = true)

        }
    },
    filters: {
        timeFormat: function (value) {
            return value.slice(0, -3)
        },
        priceFormat: function (value){
            return "R$"+value.toFixed(2).toString()
        }
    },

    mounted: function () {
        this.getRoute();
        this.getTravels();
    }
});
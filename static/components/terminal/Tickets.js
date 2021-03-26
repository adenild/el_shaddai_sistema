const delay = ms => new Promise(res => setTimeout(res, ms));

function dateFormat (value) {
    let newValue = value.split('-')
    return newValue[2] + '/' + newValue[1] + '/' + newValue[0]
}

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
            tickets: {},
            discounts: [
                {"type": "Idoso", "value": 80},
                {"type": "Idoso acompanhado", "value": 60},
                {"type": "Gestante", "value": 50},
                {"type": "Gestante acompanhada", "value": 30},
                {"type": "CAD Único", "value": 70}
            ],
            selected: null
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
            scope.form.total_price = (scope.form.travel.price * scope.form.change_price/100).toFixed(2);
        },
        applyDiscount: function (discountIndex) {
            let scope = this;
            scope.form.change_price = 100;
            scope.form.change_price = scope.form.change_price - scope.discounts[discountIndex].value;
            this.calculatePrice();
        },
        fillTravel: function (travelId) {
            let scope = this;
            scope.form.change_price = 100;
            scope.form.travel.id = travelId.toString();
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
        },
        getTickets: async function () {
            let scope = this;
            let response = await $.ajax({
                method: "POST",
                url: "/terminal/api/ticket/read",
                credentials: 'include',
                headers: {'X-CSRFToken': this.getCookie("csrftoken")}
            });
            scope.tickets = response["data"];

            for (let key in scope.tickets) {
                let object = scope.tickets[key];
                object["travel"] = scope.travels[object["travel_id"]];
            }
        },
        selectRow: function (rowId) {
            let scope = this;
            scope.selected = scope.tickets[rowId.toString()];
            scope.selected["id"] = rowId.toString();
        },
        deleteTicket: function () {
            let scope = this;
            const params = {id: scope.selected.id};
            $.ajax({
                method: "POST",
                url: "/terminal/api/ticket/delete",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (){
                    delete scope.tickets[scope.selected.id]
                    scope.selected = null
                }
            }).catch(error => scope.booleans.failed = true)

        },
        fillForm: function () {
            let scope = this;
            scope.form = {
                travel: {
                    id: scope.selected["travel_id"],
                    text: `${scope.selected.travel.route.origin} - ${scope.selected.travel.route.destiny}`,
                    price: scope.selected.travel["base_price"],
                },
                change_price: scope.selected.change_price,
                passenger_name: scope.selected.passenger_name,
                passenger_birthday: dateFormat(scope.selected.passenger_birthday),
                passenger_cpf: scope.selected.passenger_cpf,
                passenger_id: scope.selected["passenger_id_id"],
                payment_method: scope.selected.payment_method,
                total_price: scope.selected.total_price
            }
        },
        updateTicket: function () {
            let scope = this;
            let params = scope.form;
            params["id"] = scope.selected.id;
            $.ajax({
                method: "POST",
                url: "/terminal/api/ticket/update",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (){
                    location.reload();
                }
            }).catch(error => scope.booleans.failed = true)

        },
    },
    filters: {
        dateFormat: function (value) {
            let newValue = value.split('-')
            return newValue[2] + '/' + newValue[1] + '/' + newValue[0]
        },
        timeFormat: function (value) {
            return value.slice(0, -3)
        },
        priceFormat: function (value){
            return "R$"+Number(value).toFixed(2).toString()
        }
    },

    mounted: async function () {
        this.getRoute();
        await delay(500);
        this.getTravels();
        await delay(500);
        this.getTickets();
    }
});
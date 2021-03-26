const delay = ms => new Promise(res => setTimeout(res, ms));

function dateFormat (value) {
    let newValue = value.split('-')
    return newValue[2] + '/' + newValue[1] + '/' + newValue[0]
}

let app = new Vue({
    el: '#vehicles',
    data: function () {
        return {
            form: {
                name: null,
                model: null,
                age: null,
                status: null,
                max_speed: null,
                max_passengers: null,
                next_maintenance: null,
                driver: null,
            },
            booleans: {
                add: null,
                load: null,
                update: null,
                updateFailed: null,
                delete: null
            },
            vehicles: {},
            routes: {},
            selected: null
        }
    },
    methods: {
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
        selectRow: function (id) {
            let scope = this;
            scope.selected = scope.vehicles[id.toString()];
            scope.selected["id"] = id.toString();
        },
        fillForm: function () {
            let scope = this;
            scope.form = {
                name: scope.selected.name,
                model: scope.selected.model,
                age: scope.selected.age,
                status: scope.selected.status,
                max_speed: scope.selected.max_speed,
                max_passengers: scope.selected.max_passengers,
                next_maintenance: dateFormat(scope.selected.next_maintenance),
                driver: scope.selected.driver
            }
        },
        addVehicle: async function () {
            let scope = this;
            const params = scope.form;
            await $.ajax({
                method: "POST",
                url: "/terminal/api/vehicle/create",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (response) {
                    location.reload()
                }
            }).catch(error => scope.booleans.failed = true)
        },
        getVehicles: async function () {
            let scope = this;
            let request = await $.ajax({
                method: "POST",
                url: "/terminal/api/vehicle/read",
                credentials: 'include',
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (response) {
                    scope.vehicles = response["data"];
                    scope.booleans.load = true;
                }
            });

        },
        updateVehicle: async function () {
            let scope = this;
            let params = scope.form;
            params["id"] = scope.selected.id;
            await $.ajax({
                method: "POST",
                url: "/terminal/api/vehicle/update",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (){
                    location.reload();
                }
            }).catch(error => scope.booleans.updateFailed = true)
        },
        deleteVehicle: async function () {
            let scope = this;
            const params = {id: scope.selected.id};
            $.ajax({
                method: "POST",
                url: "/terminal/api/vehicle/delete",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (){
                    delete scope.vehicles[scope.selected.id];
                    scope.selectRow(1);
                    scope.booleans.update = false;
                }
            }).catch(error => scope.booleans.delete = true)
        },
    },
    filters: {
        dateFormat: function (value) {
            let newValue = value.split('-')
            return newValue[2] + '/' + newValue[1] + '/' + newValue[0]
        },
    },
    mounted: async function () {
        await this.getVehicles();
        await delay(100);
        this.selectRow(1);

    }
})
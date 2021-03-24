let app = new Vue({
    el: '#app',
    data: function () {
        return {
            form: {
                name: null,
                cpf: null,
                birthday: null,
                email: null,
                username: null,
                password: null
            },
            booleans: {
                failed: null
            }
        }
    },
    methods: {


        getCookie: function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            alert(cookieValue)
            return cookieValue;
        },

        userRegister: function () {
            let scope = this;
            const params = scope.form;
            $.ajax({
                method: "POST",
                url: "/system/signup",
                data: params,
                credentials: 'include',
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
            }).then(response => console.log("funcionou"))
                .catch(error => scope.booleans.failed = true)
        }
    },
});
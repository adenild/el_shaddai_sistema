let app = new Vue({
  el: '#app',
  data: function() {
    return {
      form: {
        username: null,
        password: null
      },
      booleans: {
        failed: null
      }
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

    userLogin: function () {
      let scope = this;
      const params = scope.form;
      $.ajax({
        method: "POST",
        url: "/system/login",
        data: params,
        credentials: 'include',
        headers: {'X-CSRFToken': this.getCookie("csrftoken")},
      }).then(response => window.location.replace("/"))
          .catch(error => scope.booleans.failed = true)
    }
  },
});
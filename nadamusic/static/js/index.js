let params = new URLSearchParams(window.location.search);
if (params.has('connections')) {
    $('#connectionModal').modal('show');
}
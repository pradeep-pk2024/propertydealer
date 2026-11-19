$(document).ready(function(){

    $.getJSON('/property/fetch_all_states',function(response){
        var states = response.data
        states.map((item)=>{
           $('#stateid').append($('<option>').text(item.statename).val(item.stateid))  
        })
    })

    $('#stateid').change(function(){

        $.getJSON('/property/fetch_all_cities',{stateid:$('#stateid').val()},function(response){
            var cities =response.data

            $('#cityid').empty()
            $('#cityid').append($('<option>').text('Select City'))

            cities.map((item)=>{
                $('#cityid').append($('<option>').text(item.cityname).val(item.cityid))
            })
        })
    })

    $('#cityid').change(function(){

        $.getJSON('/property/fetch_all_places',{cityid:$('#cityid').val()},function(response){
            var places =response.data

            $('#placeid').empty()
            $('#placeid').append($('<option>').text('Select Place'))

            places.map((item)=>{
                $('#placeid').append($('<option>').text(item.placename).val(item.placeid))
            })
        })
    })

})
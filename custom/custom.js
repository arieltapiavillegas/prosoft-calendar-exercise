// Startup
$(
		function ()
		{
			$('.calendar').datetimepicker(
					{
						timepicker: false,
						format: 'm/d/Y',
						scrollInput: false,
						scrollTime: false,
						scrollMonth: false
					}
			);

			$(".numeric").numeric();
		}
);


function processInput(formObj)
{
	var input_date = formObj.date_in.value;
	var input_days = formObj.days_in.value;
	var input_country = formObj.country_in.value.toUpperCase();


}
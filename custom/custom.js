// Startup
$(
		function ()
		{
			$('.calendar').datetimepicker(
					{
						timepicker: false,
						format: 'm/d/Y',
						scrollMonth: false
					}
			);

			$('.numeric').numeric();
		}
);


function processInput(formObj)
{
	var input_date = null;
	var input_days = null;
	var input_country = null;

	// date validation
	try
	{
		input_date = formObj.date_in.value;
		if(input_date === '')
		{
			throw 'Field is required';
		}
		input_date = stringToDate(input_date, 'mm/dd/yyyy', '/');
	}
	catch(e)
	{
		alert('Start Date error: ' + e);
	}

	// days validation
	try
	{
		input_days = formObj.days_in.value;
		if(input_days === '')
		{
			throw 'field is required';
		}
		input_days = parseInt(input_days);
		if(input_days <= 0)
		{
			throw 'number must be greater than 0';
		}
	}
	catch(e)
	{
		alert('Number of days error: ' + e);
	}

	// country validation
	try
	{
		input_country = formObj.country_in.value.toUpperCase();
		if(input_country.length === 0)
		{
			throw 'field is required';
		}

		if(input_country.length !== 2)
		{
			throw '2 letters country code is required';
		}
	}
	catch(e)
	{
		alert('Country Code error: ' + e);
	}

	
}


function stringToDate(_date, _format, _delimiter)
{
	var formatLowerCase = _format.toLowerCase();
	var formatItems = formatLowerCase.split(_delimiter);
	var dateItems = _date.split(_delimiter);
	var monthIndex = formatItems.indexOf("mm");
	var dayIndex = formatItems.indexOf("dd");
	var yearIndex = formatItems.indexOf("yyyy");
	var month = parseInt(dateItems[monthIndex]);
	month -= 1;
	return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
}


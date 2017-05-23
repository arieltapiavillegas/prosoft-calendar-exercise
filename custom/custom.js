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
	var values = parse_form(formObj);
	if(values.result === false)
	{
		alert(values.msg);
		return;
	}
	
}

function parse_form(formObj)
{
	var output = {
		result : true,
		msg    : '',
		date : null,
		days : null,
		country : null
	};

	// date validation
	try
	{
		output.date = formObj.date_in.value;
		if(output.date === '')
		{
			throw 'Field is required';
		}
		output.date = stringToDate(output.date, 'mm/dd/yyyy', '/');
	}
	catch(e)
	{
		output.result = false;
		output.msg = 'Start Date error: ' + e;
		return output;
	}

	// days validation
	try
	{
		output.days = formObj.days_in.value;
		if(output.days === '')
		{
			throw 'field is required';
		}
		output.days = parseInt(output.days);
		if(output.days <= 0)
		{
			throw 'number must be greater than 0';
		}
	}
	catch(e)
	{
		output.result = false;
		output.msg = 'Number of days error: ' + e;
		return output;
	}

	// country validation
	try
	{
		output.country = formObj.country_in.value.toUpperCase();
		if(output.country.length === 0)
		{
			throw 'field is required';
		}

		if(output.country.length !== 2)
		{
			throw '2 letters country code is required';
		}
	}
	catch(e)
	{
		output.result = false;
		output.msg = 'Country Code error: ' + e;
		return output;
	}
	
	return output;
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


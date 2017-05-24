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
	var years = [];

	var year = null;
	var month = null;
	var week = null;

	// validate and parse inputs
	var values = parse_form(formObj);
	if (values.result === false)
	{
		alert(values.msg);
		return;
	}


	// create calendar

	var month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	for (i = 0; i < values.days; i++, values.date.setDate(values.date.getDate() + 1))
	{
		var print_date = values.date.toLocaleFormat("date_%Y_%m_%d");
		var t_year = values.date.getFullYear();
		var t_month = values.date.getMonth() + 1;
		var t_day = values.date.getDate();
		var t_last_month_day = values.date.getDaysInMonth();
		var t_weekday = values.date.getDay();

		if (week === null)
		{
			week = {days: [
					{color: 'gray'},
					{color: 'gray'},
					{color: 'gray'},
					{color: 'gray'},
					{color: 'gray'},
					{color: 'gray'},
					{color: 'gray'}
				]};
		}

		week.days[t_weekday].color = (t_weekday === 0) || (t_weekday === 6) ? 'yellow' : 'green';
		week.days[t_weekday].date = print_date;
		week.days[t_weekday].day = t_day;

		// commit Week
		if ((t_weekday === 6) || (t_day === t_last_month_day) || (i === values.days - 1))
		{
			if (month === null)
			{
				month = {
					monthname: month_name[t_month - 1],
					monthnumber: t_month,
					weeks: []
				};
			}
			month.weeks[month.weeks.length] = week;


			// commit Month
			if ((t_day === t_last_month_day) || (i === values.days - 1))
			{
				if (year === null)
				{
					year = {
						yearnumber: t_year,
						months: []
					};
				}
				year.months[year.months.length] = month;
				// commit year
				if ((t_month === 12) || (i === values.days - 1))
				{
					years[years.length] = year;
					year = null;
				}
				month = null;
			}
			week = null;
		}
	}

	// Show parsed calendar
	var data = {years: years};
	var tpl = $('#template').html();
	var html = Mustache.to_html(tpl, data);
	$('#outputPanel').html(html);


	// search holidays
	for (y in years)
	{
		var year = years[y];
		for (m in year.months)
		{
			var month = year.months[m];
			var holidays_url = "https://holidayapi.com/v1/holidays?country=" + values.country + "&year=" + year.yearnumber + "&month=" + month.monthnumber + "&key=4ed46d12-1583-475b-885f-31be611f06db";
			$.get(holidays_url, function (data)
			{
				if(data.status === 200)
				{
					for(d in data.holidays)
					{
						var holiday = data.holidays[d];
						id = '#date_'+holiday.date.replace(/-/gi, '_');
						$(id).removeClass('green');
						$(id).removeClass('yellow');
						$(id).addClass('orange');
						$(id).addClass('orange');
						$(id).popover(
							{
								html: true,
								trigger: 'hover',
								placement: 'top',
								container: 'body',
								content: holiday.name
							});
					}
				}
				else
				{
					alert(data.error);
					return;
				}
			});
		}
	}
}
var DATA = null;

function parse_form(formObj)
{
	var output = {
		result: true,
		msg: '',
		date: null,
		days: null,
		country: null
	};

	// date validation
	try
	{
		output.date = formObj.date_in.value;
		if (output.date === '')
		{
			throw 'Field is required';
		}
		output.date = stringToDate(output.date, 'mm/dd/yyyy', '/');
	}
	catch (e)
	{
		output.result = false;
		output.msg = 'Start Date error: ' + e;
		return output;
	}

	// days validation
	try
	{
		output.days = formObj.days_in.value;
		if (output.days === '')
		{
			throw 'field is required';
		}
		output.days = parseInt(output.days);
		if (output.days <= 0)
		{
			throw 'number must be greater than 0';
		}
	}
	catch (e)
	{
		output.result = false;
		output.msg = 'Number of days error: ' + e;
		return output;
	}

	// country validation
	try
	{
		output.country = formObj.country_in.value.toUpperCase();
		if (output.country.length === 0)
		{
			throw 'field is required';
		}

		if (output.country.length !== 2)
		{
			throw '2 letters country code is required';
		}
	}
	catch (e)
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


/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
    window.console.info('GOV.UK Prototype Kit - do not use for production');
}

$(document).ready(function(){
    window.GOVUKFrontend.initAll();
});

$('[name="changed-name"]').click(function(e) {
    var radio = $('.add-another-name');
    if (e.currentTarget.value === 'yes') {
        return radio.show().attr('aria-hidden', 'false');
    }
    return radio.hide().attr('aria-hidden', 'true');
});

var anotherNameRadio = $('.add-another-name');

var orgSetup = function() {
    if ($('input[name="whos-check"]:checked').val() === 'another-org') return anotherNameRadio.show();
    return anotherNameRadio.hide();
};

// Prevent the div with information from hiding part of SEAS-379
// $('[name="whos-check"]').on('click', orgSetup);
// $(window).on('load', orgSetup);

$('.delete-name').click(function(e) { // I had to refactor arrow functions to normal function declaration
    // I don't understand why the previous developer has decided to use the fetch api in this case
    // The business logic should happen inside the Node.js middleware 
    fetch("/citizen-application/delete-name?index=" + String(parseInt(e.currentTarget.id, 10)), {
        method: 'post',
    })
    .then(function(){
        window.location.reload()
    })
    .catch(function (err) {console.log(err)});
});

var countryArray = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'The Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo, Democratic Republic of the',
    'Congo, Republic of the',
    'Costa Rica',
    'Côte d’Ivoire',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'East Timor (Timor-Leste)',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'The Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Korea, North',
    'Korea, South',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia, Federated States of',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar (Burma)',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Sudan, South',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe',
];
var countryDropdown = $('.country-dropdown');
var countryInput = $('.country-input');

var populateDropdown = function(list) {
    countryDropdown.empty();
    list.forEach(function(c) { countryDropdown.append('<h4 class="country-option">' + c + '</h4>') });
};


$(window).on('load', function() {
    populateDropdown(countryArray);
});

countryInput.keyup(function(e) {
    countryDropdown.css('display', 'block');
    var value = e.currentTarget.value;
    populateDropdown(countryArray.filter(function(country) {
        return country.toUpperCase().substring(0, value.length) === value.toUpperCase().substring(0, value.length);
    }));
});

$(document).on('click', '.country-option', function(e) {
    $('.country-input').val(e.currentTarget.innerHTML);
    countryDropdown.css('display', 'none');
});

var radioOption = $('#radio-option-1');
var radioOptionTwo = $('#radio-option-0');

var onRadioChange = function() {
    $('.govuk-error-summary').remove();
    $('.govuk-error-message').empty();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error');
    $('.govuk-input--error').removeClass('govuk-input--error');
  };

  if (radioOption) {
    radioOption.on('change', function() {
      if (radioOption.is(':checked')) {
        onRadioChange();
      }
    });

    radioOptionTwo.on('change', function() {
        if (radioOptionTwo.is(':checked')) {
          onRadioChange();
        }
    });
  }



$(window).on('resize', function() {
    // landingSetup(); // Not sure why the previous developer was invoking an undeclared function here, I had to comment out
});

var getRandomArbitrary = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

// The postcode look up fetch should happen in the Node js middleware not here !
$('.lookup').on('click', function() {
    var postcode = $('#postcode-lookup');
    var err = $('.error-msg');
    var select = $('.postcode-select');
    if (!postcode) return;
    var firstStreetBit = ['Church', 'Park', 'Windsor', 'Orchid', 'York', 'Springfield', 'Mill'];
    var secondStreetBit = ['Street', 'Close', 'Place', 'Road', 'Lane'];
    fetch("https://api.postcodes.io/postcodes/" + postcode.val())
        .then(function(response) { return response.json(); })
        .then(function(res) {
            if (res.status !== 200) {
                err.css('display', 'block');
                return postcode.addClass('govuk-input--error');
            }
            select.prop('disabled', false);
            select.empty();
            err.css('display', 'none');
            var street = firstStreetBit[getRandomArbitrary(0, 6)] + " " + secondStreetBit[getRandomArbitrary(0, 4)];
            Array.from(Array(10))
                .map(function() { return (getRandomArbitrary(3, 50) + " " + street); })
                .forEach(function(el) { select.append('<option value="' + el + '">' + el + '</option>') });
            $('.hidden-details-city').val(res.result.admin_county);
            $('.hidden-details-town').val(res.result.parish);
            return postcode.removeClass('govuk-input--error');
        });
});

/* dbs-check-level */
var changeContinueBtn = function(btnId, value, inputName) {
    var btn = $("#" + btnId);
    if ($('input[name="' + inputName + '"]:checked').val() === value) {
        btn.text('Continue');
    } else {
        btn.text('Check Answers');
    }
};

$('[name="what-dbs-check"]').on('click', function(){
    changeContinueBtn('enhanced-barred-check-btn', 'Enhanced with barred list', 'what-dbs-check')
});

$(window).on('load', function() {
    changeContinueBtn('enhanced-barred-check-btn', 'Enhanced with barred list', 'what-dbs-check')
});

/* applicant-or-post-holder */

$('[name="what-application-type"]').on('click', function(){
    changeContinueBtn('app-or-post-change-btn', 'Volunteer', 'what-application-type')
});

$(window).on('load', function() {
    changeContinueBtn('app-or-post-change-btn', 'Volunteer', 'what-application-type')
});

/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
    window.console.info('GOV.UK Prototype Kit - do not use for production');
}

$(document).ready(() => {
    window.GOVUKFrontend.initAll();
});

$('[name="changed-name"]').click(e => {
    const radio = $('.add-another-name');
    if (e.currentTarget.value === 'yes') {
        return radio.show().attr('aria-hidden', 'false');
    }
    return radio.hide().attr('aria-hidden', 'true');
});

const anotherNameRadio = $('.add-another-name');

const orgSetup = () => {
    if ($('input[name="whos-check"]:checked').val() === 'another-org') return anotherNameRadio.show();
    return anotherNameRadio.hide();
};

$('[name="whos-check"]').on('click', orgSetup);
$(window).on('load', orgSetup);

$('.delete-name').click(e => {
    fetch(`/citizen-application/delete-name?index=${parseInt(e.currentTarget.id, 10)}`, {
        method: 'post',
    })
        .then(() => window.location.reload())
        .catch(err => console.log(err));
});

const countryArray = [
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
const countryDropdown = $('.country-dropdown');
const countryInput = $('.country-input');

const populateDropdown = list => {
    countryDropdown.empty();
    list.forEach(c => countryDropdown.append(`<h4 class="country-option">${c}</h4>`));
};

// const details = $('.details');
// const landingSetup = () => {
//     if ($('.landing-table')) {
//         if (window.innerWidth < 800) {
//             details.css('display', 'table-cell');
//             ['status', 'type', 'mod-date', 'status-cell', 'type-cell', 'mod-date-cell'].forEach(item => $(`.${item}`).css('display', 'none'));
//         } else {
//             details.css('display', 'none');
//             ['status', 'type', 'mod-date', 'status-cell', 'type-cell', 'mod-date-cell'].forEach(item => $(`.${item}`).css('display', 'table-cell'));
//         }
//     }
// };

$(window).on('load', () => {
    // landingSetup(); // Not sure why the previous developer was invoking an undeclared function here
    populateDropdown(countryArray);
});

countryInput.keyup(e => {
    countryDropdown.css('display', 'block');
    const { value } = e.currentTarget;
    populateDropdown(
        countryArray.filter(country => country.toUpperCase().substring(0, value.length) === value.toUpperCase().substring(0, value.length)),
    );
});

$(document).on('click', '.country-option', e => {
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



$(window).on('resize', () => {
    // landingSetup(); // Not sure why the previous developer was invoking an undeclared function here
});

const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

$('.lookup').on('click', async () => {
    const postcode = $('#postcode-lookup');
    const err = $('.error-msg');
    const select = $('.postcode-select');
    if (!postcode) return;
    const firstStreetBit = ['Church', 'Park', 'Windsor', 'Orchid', 'York', 'Springfield', 'Mill'];
    const secondStreetBit = ['Street', 'Close', 'Place', 'Road', 'Lane'];
    fetch(`https://api.postcodes.io/postcodes/${postcode.val()}`)
        .then(response => response.json())
        .then(res => {
            if (res.status !== 200) {
                err.css('display', 'block');
                return postcode.addClass('govuk-input--error');
            }
            select.prop('disabled', false);
            select.empty();
            err.css('display', 'none');
            const street = `${firstStreetBit[getRandomArbitrary(0, 6)]} ${secondStreetBit[getRandomArbitrary(0, 4)]}`;
            Array.from(Array(10))
                .map(() => `${getRandomArbitrary(3, 50)} ${street}`)
                .forEach(el => select.append(`<option value="${el}">${el}</option>`));
            $('.hidden-details-city').val(res.result.admin_county);
            $('.hidden-details-town').val(res.result.parish);
            return postcode.removeClass('govuk-input--error');
        });
});

/* dbs-check-level */
const changeContinueBtn = (btnId, value, inputName) => {
    const btn = $(`#${btnId}`);
    if ($(`input[name="${inputName}"]:checked`).val() === value) {
        btn.text('Continue');
    } else {
        btn.text('Check Answers');
    }
};

$('[name="what-dbs-check"]').on('click', () => changeContinueBtn('enhanced-barred-check-btn', 'Enhanced with barred list', 'what-dbs-check'));
$(window).on('load', () => changeContinueBtn('enhanced-barred-check-btn', 'Enhanced with barred list', 'what-dbs-check'));

/* applicant-or-post-holder */

$('[name="what-application-type"]').on('click', () => changeContinueBtn('app-or-post-change-btn', 'Volunteer', 'what-application-type'));
$(window).on('load', () => changeContinueBtn('app-or-post-change-btn', 'Volunteer', 'what-application-type'));

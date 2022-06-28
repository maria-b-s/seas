/* global $ */
const body = $('body');

body.on('submit', 'form', () => {
    // On form submit, add hidden inputs for checkboxes so the server knows if
    // they've been unchecked. This means we can automatically store and update
    // all form data on the server, including checkboxes that are checked, then
    // later unchecked

    // 28 Jun 2022  Dev info: I had to add a check "if (checkboxes && checkboxes.length)..." because this script was erroring everywhere
    // Very confused about what this script supposed to do

    const checkboxes = $(this).find('input:checkbox');

    const $inputs = [];
    const names = {};

    if (checkboxes && checkboxes.length) {
        checkboxes.each(() => {
            const $this = $(this);
    
            if (!names[$this.attr('name')]) {
                names[$this.attr('name')] = true;
                const $input = $('<input type="hidden">');
                $input.attr('name', $this.attr('name'));
                $input.attr('value', '_unchecked');
                $inputs.push($input);
            }
        });

        $(this).prepend($inputs);
    }
});

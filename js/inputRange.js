jQuery(document).ready(function() {
	$('.upper').on('input', setFill);
	$('.lower').on('input', setFill);

	var max = $('.upper').attr('max');
	var min = $('.lower').attr('min');

	function setFill(evt) {
		var valUpper = $('.upper').val();
		var valLower = $('.lower').val();
		if (parseFloat(valLower) > parseFloat(valUpper)) {
			var trade = valLower;
			valLower = valUpper;
			valUpper = trade;
		}
		
		var width = valUpper * 100 / max;
		var left = valLower * 100 / max;
		$('.fill').css('left', 'calc(' + left + '%)');
		$('.fill').css('width', width - left + '%');
		
		// Update info

		if (parseInt(valLower) == min) {
			$('.easy-basket-lower').val(min);
		} else {


			$('.easy-basket-lower').val(parseInt(valLower));
		}
		if (parseInt(valUpper) == max) {

			$('.easy-basket-upper').val(max);
		} else {

			$('.easy-basket-upper').val(parseInt(valUpper));
		}
	}
	
	// изменяем диапазон цен вручную
	$('.easy-basket-filter-info p input').keyup(function() {
		var valUpper = +$('.easy-basket-upper').val();
		if(valUpper == '' || valUpper == 0 || valUpper>max){
			valUpper = max;
		}
		var valLower = +$('.easy-basket-lower').val();
		if(valLower == '' || valLower == 0){
			valLower = min;
		}
		var width = valUpper * 100 / max;
		var left = valLower * 100 / max;
		if ( valUpper > max ) {
			var left = 0;
		}
		if ( valLower < min ) {
			var left = 0;
		} else if ( valLower > max ) {
			var left = 0;
		}
	
		$('.fill').css('left', 'calc(' + left + '%)');
		$('.fill').css('width', width - left + '%');
		// меняем положение ползунков
		$('.lower').val(valLower);
		$('.upper').val(valUpper);
	});
	$('.easy-basket-filter-info p input').focus(function() {
		$(this).val('');
	});
	$('.easy-basket-filter-info .iLower input').blur(function() {
		var valLower = $('.lower').val();
		$(this).val(Math.floor(valLower));
	});
	$('.easy-basket-filter-info .iUpper input').blur(function() {
		var valUpper = $('.upper').val();
		$(this).val(Math.floor(valUpper));
	});
});
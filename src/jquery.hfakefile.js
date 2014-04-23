/*
 hFakeFile v0.2
 (c) 2014 Hoelle Development e.U. - hoelle.net
 license: http://www.opensource.org/licenses/mit-license.php
 */

(function ($) {
	var hFakeFileNamespace = 'hFakeFile',
		methods = {
			init: function (options) {
				var settings = $.extend({
						// place default settings here
						barWidth: 20,
						barBackground: '#000000',
						handleBackground: '#888888',
						barPosition: 'right',
						initialScroll: 0,
						clickScrollDuration: 200,
						displayPlaceholder: '',
						indicatorLabel: 'Search ...'
					}, options),
					inputCss = {
						display: 'inline-block',
						position: 'relative',
						width: '75%',
						behavior: 'none'
					},
					indicatorCss = {
						display: 'inline-block',
						position: 'absolute',
						right: '0',
						textAlign: 'center',
						width: '24%',
						behavior: 'none'
					},
					fileCss = {
						display: 'block',
						position: 'absolute',
						width: '100%',
						height: '100%',
						left: 0,
						top: 0,
						opacity: 0,
						cursor: 'pointer',
						border: 0,
						outline: 0,
						zIndex: 5,
						behavior: 'none'
					};

				return this.each(function () {
					var $this = $(this),
						data = $this.data(hFakeFileNamespace);

					// If the plugin hasn't been initialized yet
					if (!data) {
						/*
						 Do more setup stuff here
						 */

						var $container = $('<div class="fake-file" />'),
							$file = $this.clone().removeClass('fake-file'),
							$inputDisplay = $('<input />', {
								type: 'text',
								name: $file.attr('name') + '_display',
								class: 'display',
								placeholder: settings.displayPlaceholder
							}).prop('readonly', true).css(inputCss),
							$indicator = $('<div />', {
								class: 'indicator'
							}).css(indicatorCss).text(settings.indicatorLabel);

						$container.addClass($file.attr('class'));
						$file.addClass('origin').removeAttr('name').css(fileCss);
						$container.append($inputDisplay, $indicator, $file);
						$this.replaceWith($container);

						$file.change(function (e) {
							var filename = $file.val();
							var lastDirSeparator = filename.lastIndexOf('/');
							if (lastDirSeparator == -1) {
								lastDirSeparator = filename.lastIndexOf('\\');
							}
							if (lastDirSeparator != -1) {
								filename = filename.substr(lastDirSeparator + 1);
							}
							$inputDisplay.val(filename);
						});

						$file.change();

						$this.data(hFakeFileNamespace, $.extend(settings, {
							target: $this,
							container: $container,
							inputDisplay: $inputDisplay,
							file: $file
						}));
						data = $this.data(hFakeFileNamespace);
					}

				});
			},

			destroy: function () {
				return this.each(function () {
					var $this = $(this),
						data = $this.data(hFakeFileNamespace);

					// Namespacing FTW
					$(window).unbind('.' + hFakeFileNamespace);
					data.inputDisplay.remove();
					data.container.replaceWith(data.file.removeClass('origin'));
					$this.removeData(hFakeFileNamespace);
				});
			},
		};

	$.fn.hFakeFile = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.hFakeFile');
		}
	};

})(jQuery);
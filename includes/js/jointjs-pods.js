/**
 *
 * @type {*|void|extend|extend|extend|extend}
 */
joint.shapes.basic.Pod = joint.shapes.basic.Generic.extend( {

	markup : '<g class="rotatable"><g class="scalable"><rect class="pod"/></g><g class="scalable"><rect class="magnet"/></g><text/></g>',

	color_codes : {
		'post_type' : '#06c0f1',
		'cpt' : '#06c0f1',
		'taxonomy' : '#546e7d',
		'ct' : '#f7a458',
		'user' : '#5e53a2',
		'media' : '#9f7d7e',
		'comment' : '#ef5549',
		'pod' : '#8dbc6c',
		'settings' : '#00ada4',
		'custom-simple' : '#ba81b8'
	},

	defaults : joint.util.deepSupplement( {

		type : 'basic.Pod',

		size : {
			width : 250,
			height : 60
		},

		attrs : {
			'rect.pod' : {
				stroke : '',
				'stroke-width' : "0",
				fill: '#333333',
				width : 1,
				height : 1
			},

			'rect.magnet' : {
				magnet : true,
				fill : '',
				stroke : '',
				width : 1,
				height : 60
			},

			'text' : {
				text : '',
				'ref-x' : .5,
				'ref-y' : .5,
				ref : 'rect.pod',
				'y-alignment' : 'middle',
				'x-alignment' : 'middle',
				fill : '#ffffff',
				'font-family' : 'Times',
				'font-size' : 20,
				'font-weight' : 'normal'
			}
		}

	}, joint.shapes.basic.Generic.prototype.defaults ),

	/**
	 *
	 */
	initialize: function() {

		joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);

		/**
		 * Pods specific stuff
		 */
		this.attr( {
			'rect.pod': {
				fill: this.color_codes[ this.get( 'pod_type' ) ]
			},
			text: {
				text: this.get( 'pod_name' )
			}
		} );

	}

} );

/**
 *
 * @type {*|void|extend|extend|extend|extend}
 */
joint.dia.PodsLink = joint.dia.Link.extend( {

	single_fill: '#bdc3c7',
	multi_fill: '#dd2222',

	defaults : joint.util.deepSupplement( {

		type : 'PodsLink',

		smooth: true,

		target: { selector: '.magnet' },

		attrs : {
			'.connection': {
				stroke: '#646d72',
				'stroke-dasharray': '2 4',
				'stroke-width': 2
			},
			'.marker-target': {
				d: 'M 10 0 L 0 5 L 10 10 z'
			}
		}

	}, joint.dia.Link.prototype.defaults ),

	/**
	 *
	 */
	initialize: function() {

		joint.dia.Link.prototype.initialize.apply(this, arguments);

		// Link attributes
		this.attr( {
			'.marker-target': {
				fill: ( this.get('is_multi') ) ? this.multi_fill : this.single_fill
			}
		} );

		// Bi-directional?
		if ( this.get('bidirectional').hasOwnProperty( 'sister_field_name' ) ) {

			this.attr( {
				'.connection': {
					'stroke-dasharray': ''
				},
				'.marker-source': {
					fill: ( this.get( 'bidirectional' ).is_multi ) ? this.multi_fill : this.single_fill,
					d: 'M 10 0 L 0 5 L 10 10 z'
				}
			} );

			this.label( 1, {
				position: 50,
				attrs: {
					text: {
						text: this.get( 'bidirectional' ).sister_field_name,
						'font-size': 11
					}
				}
			} );
		}

		// Link label
		this.label( 0, {
			position: -50,
			attrs: {
				text: {
					text: this.get( 'relationship_label' ),
					'font-size': 11
				}
			}
		} );
	}

} );
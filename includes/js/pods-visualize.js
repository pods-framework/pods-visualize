(function ( $ ) {
	"use strict";

	$(function () {

		var pod_data = pods_visualization_data; // global, passed via wp_localize_script

		var single_fill = '#bdc3c7';
		var multi_fill = '#dd2222';
		var color_codes = {
			'post_type': '#06c0f1',
			'cpt': '#06c0f1',
			'taxonomy': '#546e7d',
			'ct': '#f7a458',
			'user': '#5e53a2',
			'media': '#9f7d7e',
			'comment': '#ef5549',
			'pod': '#8dbc6c',
			'settings': '#00ada4',
			'custom-simple': '#ba81b8'
		};

		// ToDo: Magic numbers
		var y_offset = 85;
		var x_offset = 600;

		var graph = new joint.dia.Graph;

		var paper = new joint.dia.Paper( {
			el: $( '#paper' ),
			width: 800,
			height: 600,
			gridSize: 1,
			model: graph
		} );


		// Iterate the pods
		var y = 10;
		var x = 10;
		for ( var pod_key in pod_data ) {

			if ( !pod_data.hasOwnProperty( pod_key ) ) {
				continue;
			}

			var this_pod = pod_data[ pod_key ];
			var new_y = y;

			var pod_element = element( x, y, this_pod[ 'name' ], color_codes[ this_pod[ 'type' ] ], false );

			// Iterate the fields in this pod
			for ( var relationship_field_name in this_pod[ 'relationships' ] ) {

				if ( !this_pod[ 'relationships' ].hasOwnProperty( relationship_field_name ) ) {
					continue;
				}

				var this_relationship = this_pod[ 'relationships' ][ relationship_field_name ];

				var related_element = element( x + x_offset, new_y, this_relationship[ 'related_pod_name' ], color_codes[ this_relationship[ 'type' ] ], true );
				link ( pod_element, related_element, relationship_field_name, this_relationship[ 'is_multi' ], this_relationship[ 'bidirectional' ] );

				new_y += y_offset;
			}

			var parent_y = new_y - y;

			// Any relationships?
			if ( 0 != parent_y ) {

				// Subtract out the final increment and center vertically
				parent_y -= y_offset;
				parent_y /= 2;
			}
			else {
				// No relationships pushed the y offset, so add it
				new_y += y_offset;
			}

			// Re-position the parent pod
			pod_element.translate( x, parent_y );

			y = new_y;
		}

		paper.fitToContent( 1, 1, 100 );

		/**
		 *
		 * @param x
		 * @param y
		 * @param label
		 * @param fill
		 * @param related
		 * @returns {joint.shapes.basic.Pod} | {joint.shapes.basic.PodsRelationship}
		 */
		function element ( x, y, label, fill, related ) {

			var new_element;
			if ( related ) {
				new_element = new joint.shapes.basic.PodsRelationship( {
					position: { x: x,  y: y }
				} );
			}
			else {
				new_element = new joint.shapes.basic.Pod( {
					position: { x: x,  y: y }
				} );
			}

			new_element.attr( {
				'rect.pod': {
					fill: fill
				},
				text: {
					text: label
				}
			} );

			graph.addCell( new_element );
			return new_element;
		}

		/**
		 * @param elm1
		 * @param elm2
		 * @param label
		 * @param is_multi
		 * @param bidirectional
		 * @returns {joint.dia.Link}
		 */
		function link ( elm1, elm2, label, is_multi, bidirectional ) {

			var new_link = new joint.dia.Link( {
				source: { id: elm1.id },
				target: {
					id: elm2.id,
					selector: '.magnet'
				}
			} );

			// Link attributes
			new_link.attr( {
				'.connection': {
					stroke: '#646d72',
					'stroke-dasharray': '2 4',
					'stroke-width': 2
				},
				'.marker-target': {
					fill: ( is_multi ) ? multi_fill : single_fill,
					d: 'M 10 0 L 0 5 L 10 10 z'
				}
			} );

			// Bi-directional?
			if ( bidirectional.hasOwnProperty( 'sister_field_name' ) ) {

				new_link.attr( {
					'.connection': {
						'stroke-dasharray': ''
					},
					'.marker-source': {
						fill: ( bidirectional[ 'is_multi' ] ) ? multi_fill : single_fill,
						d: 'M 10 0 L 0 5 L 10 10 z'
					}
				} );
			}

			// Link presentation
			new_link.set( 'smooth', true );

			// Link label
			new_link.label( 0, {
				position: .8,
				attrs: {
					text: {
						text: label,
						'font-family': 'Courier New',
						'font-size': 11
					}
				}
			} );


			graph.addCell( new_link );
			return new_link;
		}

	});

}(jQuery));
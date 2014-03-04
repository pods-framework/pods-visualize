(function ( $ ) {
	"use strict";

	$(function () {

		var pod_data = pods_visualization_data; // global, passed via wp_localize_script

		// ToDo: Magic numbers
		var y_offset = 70;
		var x_offset = 500;
		var element_size = {
			width: 200,
			height: 50
		};

		var graph = new joint.dia.Graph;

		var paper = new joint.dia.Paper( {
			el: $( '#paper' ),
			width: 800,
			height: 600,
			gridSize: 1,
			model: graph
		} );

		/**
		 *
		 * @param x
		 * @param y
		 * @param label
		 * @returns joint.shapes.basic.Rect
		 */
		var element = function( x, y, label ) {

			var new_element = new joint.shapes.basic.Rect( {
				// ToDo: magic numbers
				size: element_size,
				position: { x: x,  y: y }
			} );

			new_element.attr( {
				rect: {
					fill: '#ecf0f1',
					rx: 5,
					ry: 10,
					'stroke-width': "2",
					stroke: '#bdc3c7'
				},
				text: {
					text: label,
					fill: '#000000',
					'font-family': 'Courier New',
					'font-size': 12,
					'font-weight': 'normal'
				}
			} );

			graph.addCell( new_element );
			return new_element;
		};

		/**
		 *
		 * @param elm1
		 * @param elm2
		 * @returns joint.dia.Link
		 */
		var link = function( elm1, elm2 ) {

			var new_link = new joint.dia.Link( {
				source: { id: elm1.id },
				target: { id: elm2.id }
			} );

			new_link.attr( {
				'.connection': {
					stroke: '#bdc3c7',
					'stroke-width': 2
				}
			} );
			new_link.set( 'smooth', true );

			graph.addCell( new_link );
			return new_link;
		};

		// Iterate the pods
		var y = 10;
		var x = 10;
		for ( var key in pod_data ) {
			var this_pod = pod_data[ key ];
			var new_y = y;

			var pod_element = element( x, y, this_pod.name );

			// Iterate the fields in this pod
			for ( var key in this_pod.fields ) {

				var this_field = this_pod.fields[ key ];

				if ( 'pick' == this_field.type ) {

					if ( 'pod' == this_field.pick_object ) {
						var related_element_name = this_field.pick_val;
					}
					else {
						var related_element_name = this_field.pick_object;
					}

					var related_element = element( x + x_offset, new_y, related_element_name );
					var related_element_link = link ( pod_element, related_element );

					related_element_link.label( 0, {
						position: .7,
						attrs: {
							text: { text: this_field.name }
						}
					} );

					new_y += y_offset;
				}
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

	});

}(jQuery));
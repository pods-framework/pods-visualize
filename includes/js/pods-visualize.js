/**
 *
 */
jQuery( function ( $ ) {

	pods_visualize.render(  $( '#paper' ),  pods_visualization_data ); // global, passed via wp_localize_script

} );

pods_visualize = {};

/**
 *
 */
pods_visualize.render = function( element, pod_data ) {

	this.graph = new joint.dia.Graph;

	this.paper = new joint.dia.Paper( {
		linkView: joint.dia.LinkView,
		el: element,
		width: 800,
		height: 600,
		gridSize: 1,
		model: this.graph
	} );

	var new_link;

	// ToDo: Magic numbers
	var y_offset = 85;
	var x_offset = 600;

	// Iterate the pods
	var y = 10;
	var x = 10;
	for ( var pod_key in pod_data ) {

		if ( !pod_data.hasOwnProperty( pod_key ) ) {
			continue;
		}

		var this_pod = pod_data[ pod_key ];
		var new_y = y;

		var pod_element = new joint.shapes.basic.Pod( {
			pod_name: this_pod[ 'name' ],
			pod_type: this_pod[ 'type' ]
		} );
		pod_element.translate( x, y );
		this.graph.addCell( pod_element );

		// Iterate the fields in this pod
		for ( var relationship_field_name in this_pod[ 'relationships' ] ) {

			if ( !this_pod[ 'relationships' ].hasOwnProperty( relationship_field_name ) ) {
				continue;
			}

			var this_relationship = this_pod[ 'relationships' ][ relationship_field_name ];

			var related_element = new joint.shapes.basic.Pod( {
				pod_name: this_relationship[ 'related_pod_name' ],
				pod_type: this_relationship[ 'type' ]
			} );
			//var related_element = this.element( this_relationship[ 'related_pod_name' ], this_relationship[ 'type' ] );
			related_element.translate( x + x_offset, new_y );
			this.graph.addCell( related_element );


			new_link = new joint.dia.PodsLink( {
				relationship_label: relationship_field_name,
				is_multi: this_relationship[ 'is_multi' ],
				bidirectional: this_relationship[ 'bidirectional' ],
				source: { id: pod_element.id },
				target: {
					id: related_element.id,
					selector: '.magnet'
				}
			} );

			this.graph.addCell( new_link );

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

	this.paper.fitToContent( 1, 1, 100 );
};

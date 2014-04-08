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
		el: element,
		// ToDo: Magic numbers
		width: 800,
		height: 600,
		gridSize: 1,
		model: this.graph
	} );

	var new_link;

	// ToDo: Magic numbers
	// ToDo: move placement outta here
	var y_offset = 85;
	var x_offset = 600;
	var y = 10;
	var x = 10;

	// Iterate the pods
	for ( var pod_key in pod_data ) {

		if ( !pod_data.hasOwnProperty( pod_key ) ) {
			continue;
		}

		var this_pod = pod_data[ pod_key ];
		var new_y = y; // ToDo: move placement outta here

		// Create the shape for the parent Pod
		var pod_element = new joint.shapes.basic.Pod( {
			pod_name: this_pod[ 'name' ],
			pod_type: this_pod[ 'type' ]
		} );
		pod_element.translate( x, y ); // ToDo: move placement outta here
		this.graph.addCell( pod_element );

		// Iterate the fields in this pod
		for ( var relationship_field_name in this_pod[ 'relationships' ] ) {

			if ( !this_pod[ 'relationships' ].hasOwnProperty( relationship_field_name ) ) {
				continue;
			}

			var this_relationship = this_pod[ 'relationships' ][ relationship_field_name ];

			// Create the shape for this related Pod
			var related_element = new joint.shapes.basic.Pod( {
				pod_name: this_relationship[ 'related_pod_name' ],
				pod_type: this_relationship[ 'type' ]
			} );
			related_element.translate( x + x_offset, new_y ); // ToDo: move placement outta here
			this.graph.addCell( related_element );

			// Link the parent Pod and this relationship
			new_link = new joint.dia.PodsLink( {
				source: { id: pod_element.id },
				target: { id: related_element.id },
				relationship_label: relationship_field_name,
				is_multi: this_relationship[ 'is_multi' ],
				bidirectional: this_relationship[ 'bidirectional' ]
			} );

			this.graph.addCell( new_link );

			new_y += y_offset; // ToDo: move placement outta here
		}

		// ToDo: move placement outta here
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

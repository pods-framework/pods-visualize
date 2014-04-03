
joint.shapes.basic.Pod = joint.shapes.basic.Generic.extend( {

	markup : '<g class="rotatable"><g class="scalable"><rect class="pod"/></g><text/></g>',

	defaults : joint.util.deepSupplement( {

		type : 'basic.Pod',
		size: {
			width: 250,
			height: 60
		},
		attrs : {
			'rect.pod' : {
				fill : '',
				'stroke-width': "0",
				stroke : '',
				width : 1,
				height : 1
			},
			'text' : {
				text : '',
				'ref-x' : .5,
				'ref-y' : .5,
				ref : 'rect',
				'y-alignment' : 'middle',
				'x-alignment' : 'middle',
				fill: '#ffffff',
				'font-family': 'Times',
				'font-size': 20,
				'font-weight': 'normal'
			}
		}

	}, joint.shapes.basic.Generic.prototype.defaults )
} );


joint.shapes.basic.PodsRelationship = joint.shapes.basic.Generic.extend( {

	markup : '<g class="rotatable"><g class="scalable"><rect class="pod"/></g><g class="scalable"><rect class="magnet"/></g><text/></g>',

	defaults : joint.util.deepSupplement( {

		type : 'basic.PodsRelationship',
		size: {
			width: 250,
			height: 60
		},
		attrs : {
			'rect.pod' : {
				stroke : '',
				'stroke-width': "0",
				width : 1,
				height : 1
			},
			'rect.magnet' : {
				magnet: true,
				fill: '',
				stroke: '',
				width: 1,
				height: 60
			},
			'text' : {
				text : '',
				'ref-x' : .5,
				'ref-y' : .5,
				ref : 'rect',
				'y-alignment' : 'middle',
				'x-alignment' : 'middle',
				fill: '#ffffff',
				'font-family': 'Times',
				'font-size': 20,
				'font-weight': 'normal'
			}
		}

	}, joint.shapes.basic.Generic.prototype.defaults )
} );

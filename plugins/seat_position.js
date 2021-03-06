var plugin_data = {
	id: 'seat_position',
	title: 'Seat Position',
	icon: 'event_seat',
	author: 'JannisX11',
	description: 'Preview seat positions for custom Bedrock entities',
	version: '1.0.0',
	variant: 'both'
};

window.SeatPositioner = {
	dialog: new Dialog({
		id: 'seat_position',
		title: 'Seat Position',
		width: 540,
		lines: [
			`<div class="dialog_bar">
				<label class="inline_label">Model Scale</label>
					<input type="number" id="STP-s" oninput="SeatPositioner.update()" class="dark_bordered medium_width" value="1">
			</div>`,
			`<div class="dialog_bar">
				<label class="inline_label">X: </label>
					<input type="number" id="STP-px" class="dark_bordered medium_width" oninput="SeatPositioner.update()" value="0">
				<label class="inline_label">Y: </label>
					<input type="number" id="STP-py" class="dark_bordered medium_width" oninput="SeatPositioner.update()" value="0">
				<label class="inline_label">Z: </label>
					<input type="number" id="STP-pz" class="dark_bordered medium_width" oninput="SeatPositioner.update()" value="0">
			</div>`,
			`<div class="dialog_bar">
				<input id="STP-out" class="dark_bordered input_wide code" readonly>
			</div>`
		],
		singleButton: true,
		onConfirm: function() {
			scene.remove(SeatPositioner.object);
			this.hide()
		}
	}),
	object: new THREE.Object3D(),
	setupObject: function() {

		if (SeatPositioner.init) return;

		var O = SeatPositioner.object;
		var M = new THREE.MeshLambertMaterial({color: 0xffffff});

		var head = new THREE.Mesh(new THREE.CubeGeometry(8, 8, 8), M);
		head.position.y = 22;
		O.add(head);

		var body = new THREE.Mesh(new THREE.CubeGeometry(8, 12, 4), M);
		body.position.y = 12;
		O.add(body);

		var leg_geo = new THREE.CubeGeometry();
		leg_geo.from([-2, -12, -2]);
		leg_geo.to([2, 0, 2]);

		var leg_r = new THREE.Mesh(leg_geo, M);
		leg_r.position.set(2, 6, 0);
		leg_r.rotation.x = Math.degToRad(70);
		leg_r.rotation.z = Math.degToRad(13);
		O.add(leg_r);

		var leg_l = new THREE.Mesh(leg_geo, M);
		leg_l.position.set(-2, 6, 0);
		leg_l.rotation.x = Math.degToRad(70);
		leg_l.rotation.z = Math.degToRad(-13);
		O.add(leg_l);

		var arm_geo = new THREE.CubeGeometry();
		arm_geo.from([-2, -10, -2]);
		arm_geo.to([2, 2, 2]);

		var arm_r = new THREE.Mesh(arm_geo, M);
		arm_r.position.set(6, 16, 0);
		arm_r.rotation.x = Math.degToRad(36);
		O.add(arm_r);

		var arm_l = new THREE.Mesh(arm_geo, M);
		arm_l.position.set(-6, 16, 0);
		arm_l.rotation.x = Math.degToRad(36);
		O.add(arm_l);

		SeatPositioner.init = true;
	},
	update: function() {
		var pos = {
			x: trimFloatNumber(parseFloat($('#STP-px').val())||0),
			y: trimFloatNumber(parseFloat($('#STP-py').val())||0),
			z: trimFloatNumber(parseFloat($('#STP-pz').val())||0)
		};
		SeatPositioner.object.position.set(
			pos.x * -16,
			pos.y * 16,
			pos.z * -16,
		);
		var s = 1 / (parseFloat( $('#STP-s').val() )||0);
		SeatPositioner.object.scale.set(s, s, s);

		$('#STP-out').val(`"position": [ ${pos.x}, ${pos.y}, ${pos.z} ]`);

	}
};
MenuBar.addAction(new Action({
	id: 'open_seat_position',
	name: 'Seat Position',
	icon: 'event_seat',
	condition: _ => Format.bone_rig,
	click: () => {
		SeatPositioner.dialog.show();
		$('#blackout').hide(0);
		SeatPositioner.setupObject();
		scene.add(SeatPositioner.object);
	}
}), 'filter');

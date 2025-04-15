function onTACLoad() {
	// Inicializar
	fTACInitialize();
	fTACDataLoad();
}

function fTACInitialize() {
	// Resize
	fBrowserResize();
	// Cargar Combo Sitios
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {

		var vURL = fGetURLSvc("PublicadorService/getSitioList");
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			// Manejar Respuesta
			if (response.error || !response.result) {
				fMsgBox("Se ha producido un error.", "Error", "E");
				return;
			}
			fComboLoadSitio(response, "cboTACIdSitio");
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fTACDataLoad() {
	// Consulta T.Acceso
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {

		var vURL = fGetURLSvc("PublicadorService/getTAccesoList") + "&id=0";
		var deferred = request.get(vURL, {
			handleAs : "json"
		});

		deferred.then(function(response) {
			// Manejar Respuesta
			if (response.error || !response.result) {
				fMsgBox("Se ha producido un error.", "Error", "E");
				return;
			}
			// Datos
			var vData = {
				items : response.result
			};
			var jsonDataSource = new ItemFileWriteStore({
				data : vData
			});

			var layout = [ [ {
				name : "Id",
				field : "id",
				width : "100px"
			}, {
				name : "Nombre",
				field : "nombre",
				width : "300px"
			}, {
				name : "ClienTip",
				field : "tipo",
				width : "100px"
			}, {
				name : "Sitio",
				field : "idSitio",
				width : "100px"
			} ] ];

			if (dijit.byId("dgrTACList") == null) {
				oGrid = new DataGrid({
					id : "dgrTACList",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divTACList");

				oGrid.startup();
			} else {
				dijit.byId("dgrTACList").setStructure(layout);
				dijit.byId("dgrTACList").setStore(jsonDataSource);
			}
			dijit.byId("dgrTACList").update();
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fTACNuevo() {
	fSessionValidate("fTACNuevoExec");
}

function fTACNuevoExec() {
	document.getElementById("lblTACId").innerHTML = "";
	document.getElementById("txtTACId").innerHTML = "Nuevo T.Acceso";
	document.getElementById("txtTACId").idNro = "0";
	dijit.byId("txtTACNombre").set("value", "");
	dijit.byId("cboTACTipo").set("value", "");
	dijit.byId("cboTACIdSitio").set("value", "");
	document.getElementById("divTACEdit").style.display = "block";
	document.getElementById("divTACListado").style.display = "none";
}

function fTACEditar() {
	fSessionValidate("fTACEditarExec");
}

function fTACEditarExec() {
	var oGrid = dijit.byId("dgrTACList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un elemento.", "Advertencia", "W");
		return;
	}

	document.getElementById("lblTACId").innerHTML = "Id:";
	document.getElementById("txtTACId").innerHTML = oItems[0].id;
	document.getElementById("txtTACId").idNro = oItems[0].id;
	dijit.byId("txtTACNombre").set("value", oItems[0].nombre);
	dijit.byId("cboTACTipo").set("value", String(oItems[0].tipo));
	dijit.byId("cboTACIdSitio").set("value", String(oItems[0].idSitio));
	document.getElementById("divTACEdit").style.display = "block";
	document.getElementById("divTACListado").style.display = "none";
}

function fTACListar() {
	fSessionValidate("fTACListarExec");
}

function fTACListarExec() {
	document.getElementById("divTACEdit").style.display = "none";
	document.getElementById("divTACListado").style.display = "block";
	fTACDataLoad();
}

function fTACGrabar() {
	fSessionValidate("fTACGrabarExec");
}

function fTACGrabarExec() {
	// Validar
	if (String(dijit.byId("txtTACNombre").get("value")).length == 0) {
		fMsgBox("Debe ingresar un nombre.", "Advertencia", "W");
		return;
	}
	if (String(dijit.byId("cboTACTipo").get("value")).length == 0) {
		fMsgBox("Debe seleccionar un ClienTip.", "Advertencia", "W");
		return;
	}
	if (String(dijit.byId("cboTACIdSitio").get("value")).length == 0) {
		fMsgBox("Debe seleccionar un sitio.", "Advertencia", "W");
		return;
	}

	// Grabar T.Acceso
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("PublicadorService/setTAcceso") + "&id="
				+ document.getElementById("txtTACId").idNro + "&nombre="
				+ fEncodeURI(dijit.byId("txtTACNombre").get("value"))
				+ "&tipo=" + dijit.byId("cboTACTipo").get("value")
				+ "&idSitio=" + dijit.byId("cboTACIdSitio").get("value");
		var deferred = request.get(vURL, {
			handleAs : "json"
		});

		deferred.then(function(response) {
			// Manejar Respuesta
			if (response.error || !response.result
					|| response.result.length == 0 || response.result != "OK") {
				fMsgBox("Se ha producido un error.", "Error", "E");
				return;
			}
			fTACListar();
			// Mensaje de exito
			fMsgBox("Grabaci&oacute;n exitosa.", "Publicador", "O");
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fTACEliminar() {
	fSessionValidate("fTACEliminarExec");
}

function fTACEliminarExec() {
	var oGrid = dijit.byId("dgrTACList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un elemento.", "Advertencia", "W");
		return;
	}

	// Eliminar T.Acceso
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("PublicadorService/setTAcceso") + "&id="
				+ oItems[0].id + "&nombre=" + "&tipo=" + "&idSitio=0";
		var deferred = request.get(vURL, {
			handleAs : "json"
		});

		deferred.then(function(response) {
			// Manejar Respuesta
			if (response.error || !response.result
					|| response.result.length == 0 || response.result != "OK") {
				fMsgBox("Se ha producido un error.", "Error", "E");
				return;
			}
			fTACDataLoad();
			// Mensaje de exito
			fMsgBox("Eliminaci&oacute;n exitosa.", "Publicador", "O");
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}
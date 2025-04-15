function onSITLoad() {
	// Inicializar
	fSITInitialize();
	fSITDataLoad();
}

function fSITInitialize() {
	// Resize
	fBrowserResize();
}

function fSITDataLoad() {
	// Consulta Sitios
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {

		var vURL = fGetURLSvc("PublicadorService/getSitioList");
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
				name : "URL",
				field : "url",
				width : "400px"
			} ] ];

			if (dijit.byId("dgrSITList") == null) {
				oGrid = new DataGrid({
					id : "dgrSITList",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divSITList");

				oGrid.startup();
			} else {
				dijit.byId("dgrSITList").setStructure(layout);
				dijit.byId("dgrSITList").setStore(jsonDataSource);
			}
			dijit.byId("dgrSITList").update();
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fSITNuevo() {
	fSessionValidate("fSITNuevoExec");
}

function fSITNuevoExec() {
	document.getElementById("lblSITId").innerHTML = "";
	document.getElementById("txtSITId").innerHTML = "Nuevo Sitio";
	document.getElementById("txtSITId").idNro = "0";
	dijit.byId("txtSITNombre").set("value", "");
	dijit.byId("txtSITURL").set("value", "");
	document.getElementById("divSITEdit").style.display = "block";
	document.getElementById("divSITListado").style.display = "none";
}

function fSITEditar() {
	fSessionValidate("fSITEditarExec");
}

function fSITEditarExec() {
	var oGrid = dijit.byId("dgrSITList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un elemento.", "Advertencia", "W");
		return;
	}

	document.getElementById("lblSITId").innerHTML = "Id:";
	document.getElementById("txtSITId").innerHTML = oItems[0].id;
	document.getElementById("txtSITId").idNro = oItems[0].id;
	dijit.byId("txtSITNombre").set("value", oItems[0].nombre);
	dijit.byId("txtSITURL").set("value", oItems[0].url);
	document.getElementById("divSITEdit").style.display = "block";
	document.getElementById("divSITListado").style.display = "none";
}

function fSITListar() {
	fSessionValidate("fSITListarExec");
}

function fSITListarExec() {
	document.getElementById("divSITEdit").style.display = "none";
	document.getElementById("divSITListado").style.display = "block";
	fSITDataLoad();
}

function fSITGrabar() {
	fSessionValidate("fSITGrabarExec");
}

function fSITGrabarExec() {
	// Validar
	if (String(dijit.byId("txtSITNombre").get("value")).length == 0) {
		fMsgBox("Debe ingresar un nombre.", "Advertencia", "W");
		return;
	}

	// Grabar Sitios
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("PublicadorService/setSitio") + "&id="
				+ document.getElementById("txtSITId").idNro + "&nombre="
				+ fEncodeURI(dijit.byId("txtSITNombre").get("value")) + "&url="
				+ fEncodeURI(dijit.byId("txtSITURL").get("value"));
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
			fSITListar();
			// Mensaje de exito
			fMsgBox("Grabaci&oacute;n exitosa.", "Publicador", "O");
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fSITEliminar() {
	fSessionValidate("fSITEliminarExec");
}

function fSITEliminarExec() {
	var oGrid = dijit.byId("dgrSITList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un elemento.", "Advertencia", "W");
		return;
	}

	// Eliminar Sitios
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("PublicadorService/setSitio") + "&id="
				+ oItems[0].id + "&nombre=" + "&url=";
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
			fSITDataLoad();
			// Mensaje de exito
			fMsgBox("Eliminaci&oacute;n exitosa.", "Publicador", "O");
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}
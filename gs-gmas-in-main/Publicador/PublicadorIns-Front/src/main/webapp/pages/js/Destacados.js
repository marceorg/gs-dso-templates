function onDESLoad() {
	// Inicializar
	fDESInitialize();
	fDESDataLoad();
}

function fDESInitialize() {
	// Resize
	fBrowserResize();
}

function fDESDataLoad() {
	// Consulta Destacados
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {

		var vURL = fGetURLSvc("PublicadorService/getDestacadoList") + "&id=0"
				+ "&traerVencidas=S";
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
				name : "T&iacute;tulo",
				field : "titulo",
				width : "400px"
			}, {
				name : "Fecha Hasta",
				field : "fechaHasta",
				formatter : fDgrColFec,
				width : "100px"
			}, {
				name : "Publicar",
				field : "publicar",
				formatter : fDgrColSyN,
				width : "100px"
			}, {
				name : "Sitios",
				field : "cantSitios",
				width : "100px"
			} ] ];

			if (dijit.byId("dgrDESList") == null) {
				oGrid = new DataGrid({
					id : "dgrDESList",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divDESList");

				oGrid.startup();
			} else {
				fGridClean("dgrDESList");
				dijit.byId("dgrDESList").setStructure(layout);
				dijit.byId("dgrDESList").setStore(jsonDataSource);
			}
			dijit.byId("dgrDESList").update();
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fDESNuevo() {
	fSessionValidate("fDESNuevoExec");
}

function fDESNuevoExec() {
	document.getElementById("lblDESId").innerHTML = "";
	document.getElementById("txtDESId").innerHTML = "Nuevo Destacado";
	document.getElementById("txtDESId").idNro = "0";
	dijit.byId("txtDESTitulo").set("value", "");
	dijit.byId("txtDESSubtitulo").set("value", "");
	dijit.byId("txtDESDescripcion").set("value", "");
	dijit.byId("txtDESImagen").set("value", "");
	dijit.byId("txtDESFechaDesde").set("value", null);
	dijit.byId("txtDESFechaHasta").set("value", null);
	dijit.byId("cboDESRotacion").set("value", "");
	dijit.byId("cboDESPublicar").set("value", "");
	document.getElementById("divDESEdit").style.display = "block";
	document.getElementById("divDESListado").style.display = "none";
}

function fDESEditar() {
	fSessionValidate("fDESEditarExec");
}

function fDESEditarExec() {
	var oGrid = dijit.byId("dgrDESList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un elemento.", "Advertencia", "W");
		return;
	}

	document.getElementById("lblDESId").innerHTML = "Id:";
	document.getElementById("txtDESId").innerHTML = oItems[0].id;
	document.getElementById("txtDESId").idNro = oItems[0].id;
	dijit.byId("txtDESTitulo").set("value", oItems[0].titulo);
	dijit.byId("txtDESSubtitulo").set("value", oItems[0].subtitulo);
	dijit.byId("txtDESDescripcion").set("value", String(oItems[0].descripcion));
	dijit.byId("txtDESImagen").set("value", oItems[0].imagen);
	dijit.byId("txtDESFechaDesde").set("value",
			fFormatDTB(oItems[0].fechaDesde));
	dijit.byId("txtDESFechaHasta").set("value",
			fFormatDTB(oItems[0].fechaHasta));
	dijit.byId("cboDESRotacion").set("value", oItems[0].rotacion);
	dijit.byId("cboDESPublicar").set("value", oItems[0].publicar);
	document.getElementById("divDESEdit").style.display = "block";
	document.getElementById("divDESListado").style.display = "none";
}

function fDESListar() {
	fSessionValidate("fDESListarExec");
}

function fDESListarExec() {
	document.getElementById("divDESEdit").style.display = "none";
	document.getElementById("divDESListado").style.display = "block";
	fDESDataLoad();
}

function fDESGrabar() {
	fSessionValidate("fDESGrabarExec");
}

function fDESGrabarExec() {
	// Validar
	if (String(dijit.byId("txtDESDescripcion").get("value")).length == 0) {
		fMsgBox("Debe ingresar una descripci&oacute;n.", "Advertencia", "W");
		return;
	}
	if (dijit.byId("txtDESFechaDesde").get("value") == null) {
		fMsgBox("Debe ingresar una fecha desde.", "Advertencia", "W");
		return;
	}
	if (dijit.byId("txtDESFechaHasta").get("value") == null) {
		fMsgBox("Debe ingresar una fecha hasta.", "Advertencia", "W");
		return;
	}
	var vFecDes = dojo.date.locale.format(dijit.byId("txtDESFechaDesde").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtDESFechaHasta").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	if (vFecDes > vFecHas) {
		fMsgBox("La fecha hasta no debe ser menor a la fecha desde.",
				"Advertencia", "W");
		return;
	}
	if (dijit.byId("cboDESRotacion").get("value") == "") {
		fMsgBox("Debe seleccionar si se incluye en la rotaci&oacute;n.",
				"Advertencia", "W");
		return;
	}
	if (dijit.byId("cboDESPublicar").get("value") == "") {
		fMsgBox("Debe seleccionar si se publica.", "Advertencia", "W");
		return;
	}

	// Grabar Destacados
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vFecDes = dojo.date.locale.format(dijit.byId("txtDESFechaDesde")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		var vFecHas = dojo.date.locale.format(dijit.byId("txtDESFechaHasta")
				.get("value"), {
			datePattern : "yyyyMMdd",
			selector : "date"
		});
		var vURL = fGetURLSvcPost("PublicadorService/setDestacado");
		var vPar = "cache=" + fGetCacheRnd() + "&id="
				+ document.getElementById("txtDESId").idNro + "&titulo="
				+ fEncodeURI(dijit.byId("txtDESTitulo").get("value"))
				+ "&subtitulo="
				+ fEncodeURI(dijit.byId("txtDESSubtitulo").get("value"))
				+ "&descripcion="
				+ fEncodeURI(dijit.byId("txtDESDescripcion").get("value"))
				+ "&imagen="
				+ fEncodeURI(dijit.byId("txtDESImagen").get("value"))
				+ "&fechaDesde=" + vFecDes + "&fechaHasta=" + vFecHas
				+ "&rotacion=" + dijit.byId("cboDESRotacion").get("value")
				+ "&publicar=" + dijit.byId("cboDESPublicar").get("value");
		var deferred = request.post(vURL, {
			handleAs : "json",
			data : vPar
		});

		deferred.then(function(response) {
			// Manejar Respuesta
			if (response.error || !response.result
					|| response.result.length == 0 || response.result != "OK") {
				fMsgBox("Se ha producido un error.", "Error", "E");
				return;
			}
			fDESListar();
			// Mensaje de exito
			fMsgBox("Grabaci&oacute;n exitosa.", "Publicador", "O");
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fDESEliminar() {
	fSessionValidate("fDESEliminarExec");
}

function fDESEliminarExec() {
	var oGrid = dijit.byId("dgrDESList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un elemento.", "Advertencia", "W");
		return;
	}

	// Eliminar Destacados
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("PublicadorService/setDestacado") + "&id="
				+ oItems[0].id + "&titulo=" + "&subtitulo=" + "&descripcion="
				+ "&imagen=" + "&fechaDesde=0" + "&fechaHasta=0"
				+ "&rotacion=0" + "&publicar=0";
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
			fDESDataLoad();
			// Mensaje de exito
			fMsgBox("Eliminaci&oacute;n exitosa.", "Publicador", "O");
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fDESAsiDesSit() {
	fSessionValidate("fDESAsiDesSitExec");
}

function fDESAsiDesSitExec() {
	var oGrid = dijit.byId("dgrDESList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un elemento.", "Advertencia", "W");
		return;
	}

	document.getElementById("lblDESAsi").idNro = oItems[0].id;
	dijit.byId('dlgDESSitios').show();
	fDESSitiosLoad();
}

function fDESSitiosLoad() {
	// Consulta Sitios asignados/no asignados
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {

		var vURL = fGetURLSvc("PublicadorService/getSitioXDestacadoList")
				+ "&id=" + document.getElementById("lblDESAsi").idNro;
		var deferred = request.get(vURL, {
			handleAs : "json",
			sync : true
		});

		deferred.then(function(response) {
			// Manejar Respuesta
			if (response.error || !response.result
					|| response.result.length == 0) {
				fMsgBox("Se ha producido un error.", "Error", "E");
				return;
			}

			// Sitios no asignados
			var vDataNAs = {
				items : response.result
			};
			var jsonDSNas = new ItemFileWriteStore({
				data : vDataNAs
			});

			var vLayoutNAs = [ [ {
				name : "Id",
				field : "id",
				width : "50px"
			}, {
				name : "Sitio",
				field : "nombre",
				width : "200px"
			} ] ];

			if (dijit.byId("dgrDESNAsList") == null) {
				oGrid = new DataGrid({
					id : "dgrDESNAsList",
					store : jsonDSNas,
					structure : vLayoutNAs,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divDESNAsList");

				oGrid.startup();
			} else {
				fGridClean("dgrDESNAsList");
				dijit.byId("dgrDESNAsList").setStructure(vLayoutNAs);
				dijit.byId("dgrDESNAsList").setStore(jsonDSNas);
				dijit.byId("dgrDESNAsList").selection.clear();
			}
			dijit.byId("dgrDESNAsList").filter({
				url : 'N'
			});
			dijit.byId("dgrDESNAsList").update();

			// Sitios asignados
			var vData = {
				items : response.result
			};
			var jsonDSAsi = new ItemFileWriteStore({
				data : vData
			});

			var vLayoutAsi = [ [ {
				name : "Id",
				field : "id",
				width : "50px"
			}, {
				name : "Sitio",
				field : "nombre",
				width : "200px"
			} ] ];

			if (dijit.byId("dgrDESAsiList") == null) {
				oGrid = new DataGrid({
					id : "dgrDESAsiList",
					store : jsonDSAsi,
					structure : vLayoutAsi,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divDESAsiList");

				oGrid.startup();
			} else {
				fGridClean("dgrDESAsiList");
				dijit.byId("dgrDESAsiList").setStructure(vLayoutAsi);
				dijit.byId("dgrDESAsiList").setStore(jsonDSAsi);
				dijit.byId("dgrDESAsiList").selection.clear();
			}
			dijit.byId("dgrDESAsiList").filter({
				url : 'A'
			});
			dijit.byId("dgrDESAsiList").update();
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fDESSitiosAsi() {
	fSessionValidate("fDESSitiosAsiExec");
}

function fDESSitiosAsiExec() {
	var oGrid = dijit.byId("dgrDESNAsList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un sitio sin asignar.", "Advertencia", "W");
		return;
	}

	// Asignar Sitio
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("PublicadorService/setSitioXDestacado")
				+ "&idRel=" + oItems[0].fechaAlta + "&idSitio=" + oItems[0].id
				+ "&idDestacado=" + document.getElementById("lblDESAsi").idNro;
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
			fDESSitiosLoad();
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fDESSitiosDes() {
	fSessionValidate("fDESSitiosDesExec");
}

function fDESSitiosDesExec() {
	var oGrid = dijit.byId("dgrDESAsiList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un sitio sin asignar.", "Advertencia", "W");
		return;
	}

	// Desasignar Sitio
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("PublicadorService/setSitioXDestacado")
				+ "&idRel=" + oItems[0].fechaAlta + "&idSitio=" + oItems[0].id
				+ "&idDestacado=" + document.getElementById("lblDESAsi").idNro;
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
			fDESSitiosLoad();
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}
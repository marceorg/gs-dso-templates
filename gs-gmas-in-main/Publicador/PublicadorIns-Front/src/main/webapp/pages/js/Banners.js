function onBANLoad() {
	// Inicializar
	fBANInitialize();
	fBANDataLoad();
}

function fBANInitialize() {
	// Resize
	fBrowserResize();
	// Cargar Combo Sitios
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {

		var vURL = fGetURLSvc("PublicadorService/getDestacadoList")
				+ "&id=0&traerVencidas=N";
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
			fComboLoadDestacado(response, "cboBANLinkIdDestacado");
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fBANDataLoad() {
	// Consulta Banners
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {

		var vURL = fGetURLSvc("PublicadorService/getBannerList")
				+ "&id=0&traerVencidas=S";
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
				width : "200px"
			}, {
				name : "Tipo de Link",
				field : "linkRelDestacado",
				formatter : fDgrColLnk,
				width : "100px"
			}, {
				name : "Fecha Desde",
				field : "fechaDesde",
				formatter : fDgrColFec,
				width : "100px"
			}, {
				name : "Fecha Hasta",
				field : "fechaHasta",
				formatter : fDgrColFec,
				width : "100px"
			}, {
				name : "Publicar",
				field : "publicar",
				formatter : fDgrColSyN,
				width : "70px"
			}, {
				name : "Orden",
				field : "orden",
				width : "70px"
			}, {
				name : "Sitios",
				field : "cantSitios",
				width : "70px"
			} ] ];

			if (dijit.byId("dgrBANList") == null) {
				oGrid = new DataGrid({
					id : "dgrBANList",
					store : jsonDataSource,
					structure : layout,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divBANList");

				oGrid.startup();
			} else {
				fGridClean("dgrBANList");
				dijit.byId("dgrBANList").setStructure(layout);
				dijit.byId("dgrBANList").setStore(jsonDataSource);
			}
			dijit.byId("dgrBANList").update();
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fBANNuevo() {
	fSessionValidate("fBANNuevoExec");
}

function fBANNuevoExec() {
	document.getElementById("lblBANId").innerHTML = "";
	document.getElementById("txtBANId").innerHTML = "Nuevo Banner";
	document.getElementById("txtBANId").idNro = "0";
	dijit.byId("txtBANTitulo").set("value", "");
	dijit.byId("cboBANLinkTiene").set("value", "0", false);
	dijit.byId("cboBANLinkRelDestacado").set("value", "0", false);
	dijit.byId("cboBANLinkIdDestacado").set("value", "");
	dijit.byId("txtBANLinkURL").set("value", "");
	dijit.byId("cboBANPopUpTiene").set("value", "0", false);
	dijit.byId("cboBANPopUpScrollbar").set("value", "0");
	dijit.byId("cboBANPopUpToolbar").set("value", "0");
	dijit.byId("cboBANPopUpResizable").set("value", "0");
	dijit.byId("txtBANPopUpWidth").set("value", "640");
	dijit.byId("txtBANPopUpHeight").set("value", "480");
	dijit.byId("txtBANPopUpTop").set("value", "0");
	dijit.byId("txtBANPopUpLeft").set("value", "0");
	dijit.byId("txtBANImagen").set("value", "");
	dijit.byId("cboBANUbicacion").set("value", "0");
	dijit.byId("txtBANOrden").set("value", "");
	dijit.byId("txtBANFechaDesde").set("value", null);
	dijit.byId("txtBANFechaHasta").set("value", null);
	dijit.byId("cboBANPublicar").set("value", "");
	document.getElementById("divBANEdit").style.display = "block";
	document.getElementById("divBANListado").style.display = "none";
	fBANLinkView(false);
	fBANLinkDesView(false);
	fBANLinkURLView(false);
	fBANPopUpView(false);
}

function fBANViewLink() {
	if (dijit.byId("cboBANLinkTiene").get("value") == "0") {
		fBANLinkView(false);
		fBANLinkDesView(false);
		fBANLinkURLView(false);
		fBANPopUpView(false);
	} else {
		fBANLinkView(true);
		fBANLinkDesView(dijit.byId("cboBANLinkRelDestacado").get("value") == "1");
		fBANLinkURLView(dijit.byId("cboBANLinkRelDestacado").get("value") == "0");
		fBANPopUpView(dijit.byId("cboBANPopUpTiene").get("value") == "1");
	}
}

function fBANViewLinkDes() {
	fBANLinkDesView(dijit.byId("cboBANLinkRelDestacado").get("value") == "1");
	fBANLinkURLView(dijit.byId("cboBANLinkRelDestacado").get("value") == "0");
}

function fBANViewPopUp() {
	fBANPopUpView(dijit.byId("cboBANPopUpTiene").get("value") == "1");
}

function fBANLinkView(vView) {
	document.getElementById("trBANLinkRelDestacado").style.display = (vView ? ""
			: "none");
	document.getElementById("trBANPopUpTiene").style.display = (vView ? ""
			: "none");
}

function fBANLinkDesView(vView) {
	document.getElementById("trBANLinkIdDestacado").style.display = (vView ? ""
			: "none");
}

function fBANLinkURLView(vView) {
	document.getElementById("trBANLinkURL").style.display = (vView ? ""
			: "none");
}

function fBANPopUpView(vView) {
	document.getElementById("trBANPopUpScrollbar").style.display = (vView ? ""
			: "none");
	document.getElementById("trBANPopUpToolbar").style.display = (vView ? ""
			: "none");
	document.getElementById("trBANPopUpResizable").style.display = (vView ? ""
			: "none");
	document.getElementById("trBANPopUpWidth").style.display = (vView ? ""
			: "none");
	document.getElementById("trBANPopUpHeight").style.display = (vView ? ""
			: "none");
	document.getElementById("trBANPopUpTop").style.display = (vView ? ""
			: "none");
	document.getElementById("trBANPopUpLeft").style.display = (vView ? ""
			: "none");
}

function fBANEditar() {
	fSessionValidate("fBANEditarExec");
}

function fBANEditarExec() {
	var oGrid = dijit.byId("dgrBANList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un elemento.", "Advertencia", "W");
		return;
	}

	document.getElementById("lblBANId").innerHTML = "Id:";
	document.getElementById("txtBANId").innerHTML = oItems[0].id;
	document.getElementById("txtBANId").idNro = oItems[0].id;
	dijit.byId("txtBANTitulo").set("value", oItems[0].titulo);
	dijit.byId("cboBANLinkTiene").set("value", oItems[0].linkTiene, false);
	dijit.byId("cboBANLinkRelDestacado").set("value",
			oItems[0].linkRelDestacado, false);
	dijit.byId("cboBANLinkIdDestacado").set("value", oItems[0].linkIdDestacado);
	dijit.byId("txtBANLinkURL").set("value", oItems[0].linkURL);
	dijit.byId("cboBANPopUpTiene").set("value", oItems[0].popUpTiene, false);
	dijit.byId("cboBANPopUpScrollbar").set("value", oItems[0].popUpScrollbar);
	dijit.byId("cboBANPopUpToolbar").set("value", oItems[0].popUpToolbar);
	dijit.byId("cboBANPopUpResizable").set("value", oItems[0].popUpResizable);
	dijit.byId("txtBANPopUpWidth").set("value", oItems[0].popUpWidth);
	dijit.byId("txtBANPopUpHeight").set("value", oItems[0].popUpHeight);
	dijit.byId("txtBANPopUpTop").set("value", oItems[0].popUpTop);
	dijit.byId("txtBANPopUpLeft").set("value", oItems[0].popUpLeft);
	dijit.byId("txtBANImagen").set("value", oItems[0].imagen);
	dijit.byId("cboBANUbicacion").set("value", oItems[0].ubicacion);
	dijit.byId("txtBANOrden").set("value", oItems[0].orden);
	dijit.byId("txtBANFechaDesde").set("value",
			fFormatDTB(oItems[0].fechaDesde));
	dijit.byId("txtBANFechaHasta").set("value",
			fFormatDTB(oItems[0].fechaHasta));
	dijit.byId("cboBANPublicar").set("value", oItems[0].publicar);
	document.getElementById("divBANEdit").style.display = "block";
	document.getElementById("divBANListado").style.display = "none";
	fBANViewPopUp();
	fBANViewLinkDes();
	fBANViewLink();
}

function fBANListar() {
	fSessionValidate("fBANListarExec");
}

function fBANListarExec() {
	document.getElementById("divBANEdit").style.display = "none";
	document.getElementById("divBANListado").style.display = "block";
	fBANDataLoad();
}

function fBANGrabar() {
	fSessionValidate("fBANGrabarExec");
}

function fBANGrabarExec() {
	// Validar
	if (String(dijit.byId("txtBANTitulo").get("value")).length == 0) {
		fMsgBox("Debe ingresar un t&iacute;tulo.", "Advertencia", "W");
		return;
	}
	if (dijit.byId("cboBANLinkTiene").get("value") == "1") {
		if (dijit.byId("cboBANLinkRelDestacado").get("value") == "0") {
			if (String(dijit.byId("txtBANLinkURL").get("value")).length == 0) {
				fMsgBox("Debe ingresar un link de referencia.", "Advertencia",
						"W");
				return;
			}
		} else {
			if (dijit.byId("cboBANLinkIdDestacado").get("value") == "") {
				fMsgBox("Debe seleccionar una nota destacada.", "Advertencia",
						"W");
				return;
			}
		}
		if (dijit.byId("cboBANPopUpTiene").get("value") == "1") {
			if (isNaN(dijit.byId("txtBANPopUpWidth").get("value"))) {
				fMsgBox(
						"Debe ingresar un valor 'PopUp - Width' v&aacute;lido.",
						"Advertencia", "W");
				return;
			}
			if (isNaN(dijit.byId("txtBANPopUpHeight").get("value"))) {
				fMsgBox(
						"Debe ingresar un valor 'PopUp - Height' v&aacute;lido.",
						"Advertencia", "W");
				return;
			}
			if (isNaN(dijit.byId("txtBANPopUpTop").get("value"))) {
				fMsgBox("Debe ingresar un valor 'PopUp - Top' v&aacute;lido.",
						"Advertencia", "W");
				return;
			}
			if (isNaN(dijit.byId("txtBANPopUpLeft").get("value"))) {
				fMsgBox("Debe ingresar un valor 'PopUp - Left' v&aacute;lido.",
						"Advertencia", "W");
				return;
			}
		}
	}
	if (String(dijit.byId("txtBANImagen").get("value")).length == 0) {
		fMsgBox("Debe ingresar una im&aacute;gen.", "Advertencia", "W");
		return;
	}
	if (isNaN(dijit.byId("txtBANOrden").get("value"))) {
		fMsgBox("Debe ingresar un orden v&aacute;lido.", "Advertencia", "W");
		return;
	}
	if (dijit.byId("txtBANFechaDesde").get("value") == null) {
		fMsgBox("Debe ingresar una fecha desde.", "Advertencia", "W");
		return;
	}
	if (dijit.byId("txtBANFechaHasta").get("value") == null) {
		fMsgBox("Debe ingresar una fecha hasta.", "Advertencia", "W");
		return;
	}
	var vFecDes = dojo.date.locale.format(dijit.byId("txtBANFechaDesde").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtBANFechaHasta").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	if (vFecDes > vFecHas) {
		fMsgBox("La fecha hasta no debe ser menor a la fecha desde.",
				"Advertencia", "W");
		return;
	}
	if (dijit.byId("cboBANPublicar").get("value") == "") {
		fMsgBox("Debe seleccionar si se publica.", "Advertencia", "W");
		return;
	}

	// Grabar Banners
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("PublicadorService/setBanner")
				+ fBANGrabarParam();
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
			fBANListar();
			// Mensaje de exito
			fMsgBox("Grabaci&oacute;n exitosa.", "Publicador", "O");
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fBANGrabarParam() {
	var vLinkRelDestacado = "0";
	var vLinkIdDestacado = "0";
	var vLinkURL = "";
	var vPopUpTiene = "0";
	var vPopUpScrollbar = "no";
	var vPopUpToolbar = "no";
	var vPopUpResizable = "no";
	var vPopUpWidth = 0;
	var vPopUpHeight = 0;
	var vPopUpTop = 0;
	var vPopUpLeft = 0;

	if (dijit.byId("cboBANLinkTiene").get("value") == "1") {
		if (dijit.byId("cboBANLinkRelDestacado").get("value") == "1") {
			vLinkRelDestacado = "1";
			vLinkIdDestacado = dijit.byId("cboBANLinkIdDestacado").get("value");
		} else {
			vLinkURL = dijit.byId("txtBANLinkURL").get("value");
		}
		if (dijit.byId("cboBANPopUpTiene").get("value") == "1") {
			vPopUpTiene = "1";
			vPopUpScrollbar = dijit.byId("cboBANPopUpScrollbar").get("value");
			vPopUpToolbar = dijit.byId("cboBANPopUpToolbar").get("value");
			vPopUpResizable = dijit.byId("cboBANPopUpResizable").get("value");
			vPopUpWidth = dijit.byId("txtBANPopUpWidth").get("value");
			vPopUpHeight = dijit.byId("txtBANPopUpHeight").get("value");
			vPopUpTop = dijit.byId("txtBANPopUpTop").get("value");
			vPopUpLeft = dijit.byId("txtBANPopUpLeft").get("value");
		}
	}

	var vFecDes = dojo.date.locale.format(dijit.byId("txtBANFechaDesde").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vFecHas = dojo.date.locale.format(dijit.byId("txtBANFechaHasta").get(
			"value"), {
		datePattern : "yyyyMMdd",
		selector : "date"
	});
	var vPar = "&id=" + document.getElementById("txtBANId").idNro + "&titulo="
			+ fEncodeURI(dijit.byId("txtBANTitulo").get("value")) + "&imagen="
			+ fEncodeURI(dijit.byId("txtBANImagen").get("value"))
			+ "&linkTiene=" + dijit.byId("cboBANLinkTiene").get("value")
			+ "&linkRelDestacado=" + vLinkRelDestacado + "&linkIdDestacado="
			+ vLinkIdDestacado + "&linkURL=" + fEncodeURI(vLinkURL)
			+ "&popUpTiene=" + vPopUpTiene + "&popUpScrollbar="
			+ vPopUpScrollbar + "&popUpToolbar=" + vPopUpToolbar
			+ "&popUpResizable=" + vPopUpResizable + "&popUpWidth="
			+ vPopUpWidth + "&popUpHeight=" + vPopUpHeight + "&popUpTop="
			+ vPopUpTop + "&popUpLeft=" + vPopUpLeft + "&ubicacion="
			+ dijit.byId("cboBANUbicacion").get("value") + "&orden="
			+ dijit.byId("txtBANOrden").get("value") + "&fechaDesde=" + vFecDes
			+ "&fechaHasta=" + vFecHas + "&publicar="
			+ dijit.byId("cboBANPublicar").get("value");
	return vPar;

}

function fBANEliminar() {
	fSessionValidate("fBANEliminarExec");
}

function fBANEliminarExec() {
	var oGrid = dijit.byId("dgrBANList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un elemento.", "Advertencia", "W");
		return;
	}

	// Eliminar Banners
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("PublicadorService/setBanner") + "&id="
				+ oItems[0].id + "&titulo=" + "&imagen=" + "&linkTiene=0"
				+ "&linkRelDestacado=0" + "&linkIdDestacado=0" + "&linkURL="
				+ "&popUpTiene=0" + "&popUpScrollbar=" + "&popUpToolbar="
				+ "&popUpResizable=" + "&popUpWidth=0" + "&popUpHeight=0"
				+ "&popUpTop=0" + "&popUpLeft=0" + "&ubicacion=0" + "&orden=0"
				+ "&fechaDesde=0" + "&fechaHasta=0" + "&publicar=0";
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
			fBANDataLoad();
			// Mensaje de exito
			fMsgBox("Eliminaci&oacute;n exitosa.", "Publicador", "O");
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fBANAsiDesSit() {
	fSessionValidate("fBANAsiDesSitExec");
}

function fBANAsiDesSitExec() {
	var oGrid = dijit.byId("dgrBANList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un elemento.", "Advertencia", "W");
		return;
	}

	document.getElementById("lblBANAsi").idNro = oItems[0].id;
	dijit.byId('dlgBANSitios').show();
	fBANSitiosLoad();
}

function fBANSitiosLoad() {
	// Consulta Sitios asignados/no asignados
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {

		var vURL = fGetURLSvc("PublicadorService/getSitioXBannerList") + "&id="
				+ document.getElementById("lblBANAsi").idNro;
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

			if (dijit.byId("dgrBANNAsList") == null) {
				oGrid = new DataGrid({
					id : "dgrBANNAsList",
					store : jsonDSNas,
					structure : vLayoutNAs,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divBANNAsList");

				oGrid.startup();
			} else {
				fGridClean("dgrBANNAsList");
				dijit.byId("dgrBANNAsList").setStructure(vLayoutNAs);
				dijit.byId("dgrBANNAsList").setStore(jsonDSNas);
				dijit.byId("dgrBANNAsList").selection.clear();
			}
			dijit.byId("dgrBANNAsList").filter({
				url : 'N'
			});
			dijit.byId("dgrBANNAsList").update();

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

			if (dijit.byId("dgrBANAsiList") == null) {
				oGrid = new DataGrid({
					id : "dgrBANAsiList",
					store : jsonDSAsi,
					structure : vLayoutAsi,
					rowSelector : "0px",
					rowCount : 20,
					autoHeight : true,
					autoWidth : true,
					style : 'width: 550px; height: 100px;',
					selectionMode : "single"
				}, "_divBANAsiList");

				oGrid.startup();
			} else {
				fGridClean("dgrBANAsiList");
				dijit.byId("dgrBANAsiList").setStructure(vLayoutAsi);
				dijit.byId("dgrBANAsiList").setStore(jsonDSAsi);
				dijit.byId("dgrBANAsiList").selection.clear();
			}
			dijit.byId("dgrBANAsiList").filter({
				url : 'A'
			});
			dijit.byId("dgrBANAsiList").update();
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fBANSitiosAsi() {
	fSessionValidate("fBANSitiosAsiExec");
}

function fBANSitiosAsiExec() {
	var oGrid = dijit.byId("dgrBANNAsList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un sitio sin asignar.", "Advertencia", "W");
		return;
	}

	// Asignar Sitio
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("PublicadorService/setSitioXBanner") + "&idRel="
				+ oItems[0].fechaAlta + "&idSitio=" + oItems[0].id
				+ "&idBanner=" + document.getElementById("lblBANAsi").idNro;
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
			fBANSitiosLoad();
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}

function fBANSitiosDes() {
	fSessionValidate("fBANSitiosDesExec");
}

function fBANSitiosDesExec() {
	var oGrid = dijit.byId("dgrBANAsiList");
	var oItems = oGrid.selection.getSelected();
	if (!oItems.length) {
		fMsgBox("Debe seleccionar un sitio sin asignar.", "Advertencia", "W");
		return;
	}

	// Desasignar Sitio
	require([ "dojo/request", "dojox/grid/DataGrid",
			"dojo/data/ItemFileWriteStore", "dojo/domReady!" ], function(
			request, DataGrid, ItemFileWriteStore) {
		var vURL = fGetURLSvc("PublicadorService/setSitioXBanner") + "&idRel="
				+ oItems[0].fechaAlta + "&idSitio=" + oItems[0].id
				+ "&idBanner=" + document.getElementById("lblBANAsi").idNro;
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
			fBANSitiosLoad();
		}, function(err) {
			fMsgBox("Se ha producido un error.", "Error", "E");
		});
	});
}
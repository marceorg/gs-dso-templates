/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service.impl;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import com.hsbc.hbar.bancaseg.model.bs.ConCliente;
import com.hsbc.hbar.bancaseg.model.bs.ConClienteInf;
import com.hsbc.hbar.bancaseg.model.bs.ConSiniestro;
import com.hsbc.hbar.bancaseg.model.bs.ConSiniestroInf;
import com.hsbc.hbar.bancaseg.model.bs.Denuncia;
import com.hsbc.hbar.bancaseg.model.bs.OpeEmitida;
import com.hsbc.hbar.bancaseg.model.bs.OpeEmitidaInf;
import com.hsbc.hbar.bancaseg.model.bs.OpeSiniestroInf;
import com.hsbc.hbar.bancaseg.service.JMSCommService;

public class ControllerDwlServiceImpl implements Controller {
	static Logger logger = LogManager.getLogger(ControllerDwlServiceImpl.class);

	private JMSCommService jmsCommService;

	public JMSCommService getJMSCommService() {
		if (this.jmsCommService == null) {
			this.jmsCommService = (JMSCommService) ServiceFactory.getContext().getBean("JMSCommService");
		}
		return this.jmsCommService;
	}

	public void setJMSCommService(final JMSCommService jmsCommService) {
		this.jmsCommService = jmsCommService;
	}

	public ModelAndView handleRequest(final HttpServletRequest request, final HttpServletResponse response)
			throws ServletException, IOException {
		// Se define un contador para controlar la cantidad
		// de invocaciones al AS400 y evitar un loop eterno
		Integer contMsg = 0;
		final Integer maxMsg = 50;
		try {
			String tipoInforme = request.getParameterValues("tipoInforme")[0];

			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment;filename=download.csv");
			ServletOutputStream out = response.getOutputStream();
			StringBuilder sb = null;

			if (tipoInforme.equalsIgnoreCase("COE")) {
				// Tomar los parametros
				Integer fechaDesde = Integer.parseInt(request.getParameterValues("fechaDesde")[0]);
				Integer fechaHasta = Integer.parseInt(request.getParameterValues("fechaHasta")[0]);
				Integer compania = Integer.parseInt(request.getParameterValues("compania")[0]);
				String producto = request.getParameterValues("producto")[0];
				// Lo llamo tantas veces como sea necesario
				List<OpeEmitida> opeEmitidaFinalList = null;
				OpeEmitidaInf opeEmitidaInf = this.getJMSCommService().getOpeEmitidaList(fechaDesde, fechaHasta, compania,
						producto, "");
				opeEmitidaFinalList = opeEmitidaInf.getOpeEmitidaList();
				while (!opeEmitidaInf.getParamStart().equals("") && contMsg <= maxMsg) {
					contMsg++;
					opeEmitidaInf = this.getJMSCommService().getOpeEmitidaList(fechaDesde, fechaHasta, compania, producto,
							opeEmitidaInf.getParamStart());
					for (int x = 0; x < opeEmitidaInf.getOpeEmitidaList().size(); x++) {
						opeEmitidaFinalList.add(opeEmitidaInf.getOpeEmitidaList().get(x));
					}
				}

				// Generar CSV
				sb = generateCsvFileBufferCOE(opeEmitidaFinalList);
			} else if (tipoInforme.equalsIgnoreCase("CCL")) {
				// Tomar los parametros
				String tipoBusqueda = request.getParameterValues("tipoBusqueda")[0];
				Integer tipDoc = Integer.parseInt(request.getParameterValues("tipDoc")[0]);
				String nroDoc = request.getParameterValues("nroDoc")[0];
				String apellido = request.getParameterValues("apellido")[0];
				Integer compania = Integer.parseInt(request.getParameterValues("compania")[0]);
				String poliza = request.getParameterValues("poliza")[0];
				// Lo llamo tantas veces como sea necesario
				List<ConCliente> conClienteFinalList = null;
				ConClienteInf conClienteInf = this.getJMSCommService().getConClienteList(tipoBusqueda, tipDoc, nroDoc,
						apellido, compania, poliza, "");
				conClienteFinalList = conClienteInf.getConClienteList();
				while (!conClienteInf.getParamStart().equals("") && contMsg <= maxMsg) {
					contMsg++;
					conClienteInf = this.getJMSCommService().getConClienteList(tipoBusqueda, tipDoc, nroDoc, apellido,
							compania, poliza, conClienteInf.getParamStart());
					for (int x = 0; x < conClienteInf.getConClienteList().size(); x++) {
						conClienteFinalList.add(conClienteInf.getConClienteList().get(x));
					}
				}

				// Generar CSV
				sb = generateCsvFileBufferCCL(conClienteFinalList);
			} else if (tipoInforme.equalsIgnoreCase("CSI")) {
				// Tomar los parametros
				String tipoBusqueda = request.getParameterValues("tipoBusqueda")[0];
				Integer tipDoc = Integer.parseInt(request.getParameterValues("tipDoc")[0]);
				String nroDoc = request.getParameterValues("nroDoc")[0];
				String apellido = request.getParameterValues("apellido")[0];
				Integer compania = Integer.parseInt(request.getParameterValues("compania")[0]);
				String poliza = request.getParameterValues("poliza")[0];
				String siniestro = request.getParameterValues("siniestro")[0];
				Long orden = Long.parseLong(request.getParameterValues("orden")[0]);
				String estado = request.getParameterValues("estado")[0];
				Integer fechaDesde = Integer.parseInt(request.getParameterValues("fechaDesde")[0]);
				Integer fechaHasta = Integer.parseInt(request.getParameterValues("fechaHasta")[0]);
				// Lo llamo tantas veces como sea necesario
				List<ConSiniestro> conSiniestroFinalList = null;
				ConSiniestroInf conSiniestroInf = this.getJMSCommService().getConSiniestroList(tipoBusqueda, tipDoc, nroDoc,
						apellido, poliza, siniestro, orden, compania, estado, fechaDesde, fechaHasta, "");
				conSiniestroFinalList = conSiniestroInf.getConSiniestroList();
				while (!conSiniestroInf.getParamStart().equals("") && contMsg <= maxMsg) {
					contMsg++;
					conSiniestroInf = this.getJMSCommService().getConSiniestroList(tipoBusqueda, tipDoc, nroDoc, apellido,
							poliza, siniestro, orden, compania, estado, fechaDesde, fechaHasta,
							conSiniestroInf.getParamStart());
					for (int x = 0; x < conSiniestroInf.getConSiniestroList().size(); x++) {
						conSiniestroFinalList.add(conSiniestroInf.getConSiniestroList().get(x));
					}
				}

				// Generar CSV
				sb = generateCsvFileBufferCSI(conSiniestroFinalList);
			} else if (tipoInforme.equalsIgnoreCase("OSS")) {
				// Tomar los parametros
				String tipoBusqueda = request.getParameterValues("tipoBusqueda")[0];
				Integer tipDoc = Integer.parseInt(request.getParameterValues("tipDoc")[0]);
				String nroDoc = request.getParameterValues("nroDoc")[0];
				String apellido = request.getParameterValues("apellido")[0];
				Integer compania = Integer.parseInt(request.getParameterValues("compania")[0]);
				String poliza = request.getParameterValues("poliza")[0];
				Long orden = Long.parseLong(request.getParameterValues("orden")[0]);
				String estado = request.getParameterValues("estado")[0];
				Integer fechaDesde = Integer.parseInt(request.getParameterValues("fechaDesde")[0]);
				Integer fechaHasta = Integer.parseInt(request.getParameterValues("fechaHasta")[0]);
				// Lo llamo tantas veces como sea necesario
				List<Denuncia> opeSiniestroFinalList = null;
				OpeSiniestroInf opeSiniestroInf = this.getJMSCommService().getOpeSiniestroList(tipoBusqueda, tipDoc, nroDoc,
						apellido, poliza, orden, compania, estado, fechaDesde, fechaHasta, "");
				opeSiniestroFinalList = opeSiniestroInf.getDenunciaList();
				while (!opeSiniestroInf.getParamStart().equals("") && contMsg <= maxMsg) {
					contMsg++;
					opeSiniestroInf = this.getJMSCommService().getOpeSiniestroList(tipoBusqueda, tipDoc, nroDoc, apellido,
							poliza, orden, compania, estado, fechaDesde, fechaHasta, opeSiniestroInf.getParamStart());
					for (int x = 0; x < opeSiniestroInf.getDenunciaList().size(); x++) {
						opeSiniestroFinalList.add(opeSiniestroInf.getDenunciaList().get(x));
					}
				}

				// Generar CSV
				sb = generateCsvFileBufferOSS(opeSiniestroFinalList);
			} else {
				// Si no es ninguno
				sb = new StringBuilder();
				sb.append("");
			}

			/*
			 * InputStream in = new
			 * ByteArrayInputStream(sb.toString().getBytes("UTF-8"));
			 * 
			 * byte[] outputByte = new byte[1]; // copy binary contect to output
			 * stream while (in.read(outputByte, 0, 1) != -1) {
			 * out.write(outputByte, 0, 1); }
			 */

			out.write(sb.toString().getBytes("UTF-8"));
			out.flush();
			out.close();
		} catch (Exception e) {
			ControllerDwlServiceImpl.logger.error(e);
		}

		return new ModelAndView("downloadSvc");
	}

	private static StringBuilder generateCsvFileBufferCOE(final List<OpeEmitida> opeEmitidaList) {
		StringBuilder writer = new StringBuilder();
		// Titulos
		writer.append("Cia.");
		writer.append(',');
		writer.append("Prod.");
		writer.append(',');
		writer.append("Poliza");
		writer.append(',');
		writer.append("End.");
		writer.append(',');
		writer.append("Motivo");
		writer.append(',');
		writer.append("Apellido / Nombre");
		writer.append(',');
		writer.append("Vigencia Desde");
		writer.append(',');
		writer.append("Vigencia Hasta");
		writer.append(',');
		writer.append("Fecha Emision");
		writer.append(',');
		writer.append("PNA");
		writer.append(',');
		writer.append("Precio 1er Recibo");
		writer.append('\n');
		// Datos
		for (int x = 0; x < opeEmitidaList.size(); x++) {
			writer.append(opeEmitidaList.get(x).getCompania().getName());
			writer.append(',');
			writer.append(opeEmitidaList.get(x).getProducto());
			writer.append(',');
			writer.append(opeEmitidaList.get(x).getPoliza());
			writer.append(',');
			writer.append(opeEmitidaList.get(x).getEndoso());
			writer.append(',');
			writer.append(opeEmitidaList.get(x).getMotivo().replaceAll(",", ""));
			writer.append(',');
			writer.append(opeEmitidaList.get(x).getTomador().replaceAll(",", ""));
			writer.append(',');
			writer.append(opeEmitidaList.get(x).getVigenciaDesde());
			writer.append(',');
			writer.append(opeEmitidaList.get(x).getVigenciaHasta());
			writer.append(',');
			writer.append(opeEmitidaList.get(x).getFechaEmision());
			writer.append(',');
			writer.append(opeEmitidaList.get(x).getPrima());
			writer.append(',');
			writer.append(opeEmitidaList.get(x).getPrecio());
			writer.append('\n');
		}

		return writer;
	}

	private static StringBuilder generateCsvFileBufferCCL(final List<ConCliente> conClienteList) {
		StringBuilder writer = new StringBuilder();
		// Titulos
		writer.append("Cia.");
		writer.append(',');
		writer.append("Producto");
		writer.append(',');
		writer.append("Poliza");
		writer.append(',');
		writer.append("End.");
		writer.append(',');
		writer.append("Apellido / Nombre");
		writer.append(',');
		writer.append("Estado");
		writer.append('\n');
		// Datos
		for (int x = 0; x < conClienteList.size(); x++) {
			writer.append(conClienteList.get(x).getCompania().getName());
			writer.append(',');
			writer.append(conClienteList.get(x).getProducto());
			writer.append(',');
			writer.append(conClienteList.get(x).getPoliza());
			writer.append(',');
			writer.append(conClienteList.get(x).getEndoso());
			writer.append(',');
			writer.append(conClienteList.get(x).getTomador().replaceAll(",", ""));
			writer.append(',');
			writer.append(conClienteList.get(x).getEstado());
			writer.append('\n');
		}

		return writer;
	}

	private static StringBuilder generateCsvFileBufferCSI(final List<ConSiniestro> conSiniestroList) {
		StringBuilder writer = new StringBuilder();
		// Titulos
		writer.append("Cia.");
		writer.append(',');
		writer.append("Poliza");
		writer.append(',');
		writer.append("Apellido / Nombre");
		writer.append(',');
		writer.append("Orden");
		writer.append(',');
		writer.append("Siniestro");
		writer.append(',');
		writer.append("Fecha");
		writer.append(',');
		writer.append("Estado");
		writer.append('\n');
		// Datos
		for (int x = 0; x < conSiniestroList.size(); x++) {
			writer.append(conSiniestroList.get(x).getCompania().getName());
			writer.append(',');
			writer.append(conSiniestroList.get(x).getPoliza());
			writer.append(',');
			writer.append(conSiniestroList.get(x).getTomador().replaceAll(",", ""));
			writer.append(',');
			writer.append(conSiniestroList.get(x).getOrden());
			writer.append(',');
			writer.append(conSiniestroList.get(x).getSiniestro());
			writer.append(',');
			writer.append(conSiniestroList.get(x).getFechaSiniestro());
			writer.append(',');
			writer.append(conSiniestroList.get(x).getEstado());
			writer.append('\n');
		}

		return writer;
	}

	private static StringBuilder generateCsvFileBufferOSS(final List<Denuncia> opeSiniestroList) {
		StringBuilder writer = new StringBuilder();
		// Titulos
		writer.append("Cia.");
		writer.append(',');
		writer.append("Poliza");
		writer.append(',');
		writer.append("Apellido / Nombre");
		writer.append(',');
		writer.append("Orden");
		writer.append(',');
		writer.append("Fecha");
		writer.append(',');
		writer.append("Estado");
		writer.append('\n');
		// Datos
		for (int x = 0; x < opeSiniestroList.size(); x++) {
			writer.append(opeSiniestroList.get(x).getCompania().getName());
			writer.append(',');
			writer.append(opeSiniestroList.get(x).getPoliza());
			writer.append(',');
			writer.append(opeSiniestroList.get(x).getTomador().replaceAll(",", ""));
			writer.append(',');
			writer.append(opeSiniestroList.get(x).getOrden());
			writer.append(',');
			writer.append(opeSiniestroList.get(x).getFechaSiniestro());
			writer.append(',');
			writer.append(opeSiniestroList.get(x).getEstado());
			writer.append('\n');
		}

		return writer;
	}
}

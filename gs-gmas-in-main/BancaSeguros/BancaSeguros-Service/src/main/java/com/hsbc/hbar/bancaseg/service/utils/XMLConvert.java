/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service.utils;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;

import com.hsbc.hbar.bancaseg.model.bs.Denuncia;
import com.hsbc.hbar.bancaseg.model.bs.Reclamo;

public class XMLConvert {
	static Logger logger = LogManager.getLogger(XMLConvert.class);

	final static Document strXML2Doc(final String xmlStr) {
		try {
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			factory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
			factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
			factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
			DocumentBuilder builder = factory.newDocumentBuilder();
			Document doc = builder.parse(new InputSource(new StringReader(xmlStr)));
			return doc;
		} catch (Exception e) {
			XMLConvert.logger.error(e);
		}
		return null;
	}

	final static String doc2StrXML(final Document doc) {
		try {
			DOMSource domSource = new DOMSource(doc);
			StringWriter writer = new StringWriter();
			StreamResult result = new StreamResult(writer);
			TransformerFactory tf = TransformerFactory.newInstance();
			tf.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
			tf.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
			Transformer transformer = tf.newTransformer();
			transformer.transform(domSource, result);
			return writer.toString();
		} catch (Exception e) {
			XMLConvert.logger.error(e);
			return null;
		}
	}

	private static Node getNodeByName(final Node nodeParent, final String nodeName) {
		try {
			XPath xPath = XPathFactory.newInstance().newXPath();
			XPathExpression expression = xPath.compile(nodeName);
			Node child = (Node) expression.evaluate(nodeParent, XPathConstants.NODE);
			return child;
		} catch (Exception e) {
			XMLConvert.logger.error(e);
		}

		return null;
	}

	public static String parseXML(final String pathXsl, final String xml) throws UnsupportedEncodingException,
			TransformerException {
		// Busca el recurso desde la ubicacion fisica absoluta del root
		// webapp/WEB-INF/classes indicado en el archivo .classpath
		URL url = Thread.currentThread().getContextClassLoader().getResource(pathXsl);

		// Recupera el archivo externo y lo mete en una variable
		Source xsltSource = null;
		try {
			xsltSource = new StreamSource(new File(url.toURI()));
		} catch (URISyntaxException e) {
			XMLConvert.logger.error(e);
		}

		StringWriter cadenaSalida = new StringWriter();
		Result bufferResultado = new StreamResult(cadenaSalida);
		InputStream inputStreamXml = new ByteArrayInputStream(xml.getBytes("UTF-8"));

		Source xmlSource = new StreamSource(inputStreamXml);
		TransformerFactory factoriaTrans = TransformerFactory.newInstance();
		factoriaTrans.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
		factoriaTrans.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
		Transformer transformador = factoriaTrans.newTransformer(xsltSource);
		transformador.transform(xmlSource, bufferResultado);

		return cadenaSalida.toString();
	}

	public static String getTestFile(final String file) {
		InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("test/" + file);
		try {
			InputStreamReader isr = new InputStreamReader(is);
			StringBuilder sb = new StringBuilder();
			BufferedReader br = new BufferedReader(isr);
			String read = br.readLine();
			while (read != null) {
				sb.append(read);
				read = br.readLine();
			}
			br.close();
			return sb.toString();
		} catch (Exception e) {
			XMLConvert.logger.error(e);
		}
		return null;
	}

	public static String getDateText() {
		// Agregar Fecha
		Date date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
		String dateString = formatter.format(date);
		StringBuilder dateResult = new StringBuilder();
		if (dateString.length() == 8) {
			dateResult.append(dateString.substring(6, 8));
			dateResult.append(" de ");
			switch (Integer.parseInt(dateString.substring(4, 6))) {
			case 1:
				dateResult.append("Enero");
				break;
			case 2:
				dateResult.append("Febrero");
				break;
			case 3:
				dateResult.append("Marzo");
				break;
			case 4:
				dateResult.append("Abril");
				break;
			case 5:
				dateResult.append("Mayo");
				break;
			case 6:
				dateResult.append("Junio");
				break;
			case 7:
				dateResult.append("Julio");
				break;
			case 8:
				dateResult.append("Agosto");
				break;
			case 9:
				dateResult.append("Septiembre");
				break;
			case 10:
				dateResult.append("Octubre");
				break;
			case 11:
				dateResult.append("Noviembre");
				break;
			case 12:
				dateResult.append("Diciembre");
				break;
			default:
				dateResult.append("");
			}
			dateResult.append(" de ");
			dateResult.append(dateString.substring(0, 4));
		}
		return dateResult.toString();
	}

	public static String getDenunciaXML4PDF(final Denuncia denuncia) {
		StringBuilder denBui = new StringBuilder();
		denBui.append("<denDatos>");
		denBui.append("<orden>");
		denBui.append(denuncia.getOrden().toString());
		denBui.append("</orden>");
		denBui.append("<compania>");
		denBui.append(denuncia.getCompania().getName());
		denBui.append("</compania>");
		denBui.append("<producto>");
		denBui.append(denuncia.getProducto().getName());
		denBui.append("</producto>");
		denBui.append("<poliza>");
		denBui.append(denuncia.getPoliza());
		denBui.append("</poliza>");
		denBui.append("<endoso>");
		denBui.append(denuncia.getEndoso().toString());
		denBui.append("</endoso>");
		denBui.append("<siniestro>");
		denBui.append(denuncia.getSiniestro());
		denBui.append("</siniestro>");
		denBui.append("<tomador>");
		denBui.append(denuncia.getTomador());
		denBui.append("</tomador>");
		denBui.append("<tipDoc>");
		denBui.append(denuncia.getTipDoc());
		denBui.append("</tipDoc>");
		denBui.append("<nroDoc>");
		denBui.append(denuncia.getNroDoc());
		denBui.append("</nroDoc>");
		denBui.append("<fechaDenuncia>");
		denBui.append(denuncia.getFechaDenuncia().toString());
		denBui.append("</fechaDenuncia>");
		denBui.append("<fechaSiniestro>");
		denBui.append(denuncia.getFechaSiniestro().toString());
		denBui.append("</fechaSiniestro>");
		denBui.append("<esDenAseg>");
		denBui.append(denuncia.getEsDenAseg().toString());
		denBui.append("</esDenAseg>");
		denBui.append("<denTipDoc>");
		denBui.append(denuncia.getDenTipDoc());
		denBui.append("</denTipDoc>");
		denBui.append("<denNroDoc>");
		denBui.append(denuncia.getDenNroDoc());
		denBui.append("</denNroDoc>");
		denBui.append("<denApeNom>");
		denBui.append(denuncia.getDenApeNom());
		denBui.append("</denApeNom>");
		denBui.append("<denParentesco>");
		denBui.append(denuncia.getDenParentesco().getName());
		denBui.append("</denParentesco>");
		denBui.append("<descSiniestro>");
		denBui.append(denuncia.getDescSiniestro());
		denBui.append("</descSiniestro>");
		denBui.append("<datosSiniestro>");
		denBui.append(denuncia.getDatosSiniestro());
		denBui.append("</datosSiniestro>");
		denBui.append("<adjunto1>");
		denBui.append(denuncia.getAdjunto1().toString());
		denBui.append("</adjunto1>");
		denBui.append("<adjunto2>");
		denBui.append(denuncia.getAdjunto2().toString());
		denBui.append("</adjunto2>");
		denBui.append("<adjunto3>");
		denBui.append(denuncia.getAdjunto3().toString());
		denBui.append("</adjunto3>");
		denBui.append("<estado>");
		denBui.append(denuncia.getEstado());
		denBui.append("</estado>");
		denBui.append("<peopleSoft>");
		denBui.append(denuncia.getPeopleSoft());
		denBui.append("</peopleSoft>");
		denBui.append("<usuApeNom>");
		denBui.append(denuncia.getUsuApeNom());
		denBui.append("</usuApeNom>");
		denBui.append("<fechaHoy>");
		denBui.append(getDateText());
		denBui.append("</fechaHoy>");
		denBui.append("</denDatos>");
		return denBui.toString();
	}

	public static String getReclamoXML4PDF(final Reclamo reclamo) {
		StringBuilder recBui = new StringBuilder();
		recBui.append("<recDatos>");
		recBui.append("<orden>");
		recBui.append(reclamo.getOrden().toString());
		recBui.append("</orden>");
		recBui.append("<compania>");
		recBui.append(reclamo.getCompania());
		recBui.append("</compania>");
		recBui.append("<producto>");
		recBui.append(reclamo.getProducto());
		recBui.append("</producto>");
		recBui.append("<poliza>");
		recBui.append(reclamo.getPoliza());
		recBui.append("</poliza>");
		recBui.append("<endoso>");
		recBui.append(reclamo.getEndoso().toString());
		recBui.append("</endoso>");
		recBui.append("<tomador>");
		recBui.append(reclamo.getTomador());
		recBui.append("</tomador>");
		recBui.append("<tipDoc>");
		recBui.append(reclamo.getTipDoc());
		recBui.append("</tipDoc>");
		recBui.append("<nroDoc>");
		recBui.append(reclamo.getNroDoc());
		recBui.append("</nroDoc>");
		recBui.append("<fechaPedido>");
		recBui.append(reclamo.getFechaPedido().toString());
		recBui.append("</fechaPedido>");
		recBui.append("<tipReg>");
		recBui.append(reclamo.getTipReg());
		recBui.append("</tipReg>");
		recBui.append("<motRec>");
		recBui.append(reclamo.getMotRec());
		recBui.append("</motRec>");
		recBui.append("<descRec>");
		recBui.append(reclamo.getDescRec());
		recBui.append("</descRec>");
		recBui.append("<telefono>");
		recBui.append(reclamo.getTelefono());
		recBui.append("</telefono>");
		recBui.append("<email>");
		recBui.append(reclamo.getEmail());
		recBui.append("</email>");
		recBui.append("<peopleSoft>");
		recBui.append(reclamo.getPeopleSoft());
		recBui.append("</peopleSoft>");
		recBui.append("<fechaHoy>");
		recBui.append(getDateText());
		recBui.append("</fechaHoy>");
		recBui.append("</recDatos>");
		return recBui.toString();
	}
}

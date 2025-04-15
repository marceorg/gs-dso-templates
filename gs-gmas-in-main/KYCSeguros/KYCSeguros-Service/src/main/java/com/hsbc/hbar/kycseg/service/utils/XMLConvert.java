/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2018. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.service.utils;

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
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

public class XMLConvert {
	static Logger logger = LogManager.getLogger(XMLConvert.class);

	private final static Document strXML2Doc(final String xmlStr) {
		try {
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			factory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
			factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
			factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
			DocumentBuilder builder;
			builder = factory.newDocumentBuilder();
			Document doc = builder.parse(new InputSource(new StringReader(xmlStr)));
			return doc;
		} catch (Exception e) {
			XMLConvert.logger.error(e);
		}
		return null;
	}

	private final static String doc2StrXML(final Document doc) {
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
		} catch (TransformerException ex) {
			ex.printStackTrace();
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

	private static NodeList getNodeListByName(final Node nodeParent, final String nodeName) {
		try {
			XPath xPath = XPathFactory.newInstance().newXPath();
			XPathExpression expression = xPath.compile(nodeName);
			NodeList nodeList = (NodeList) expression.evaluate(nodeParent, XPathConstants.NODESET);
			return nodeList;
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
		StringWriter cadenaSalida = new StringWriter();
		try {
			xsltSource = new StreamSource(new File(url.toURI()));
			Result bufferResultado = new StreamResult(cadenaSalida);
			InputStream inputStreamXml = new ByteArrayInputStream(xml.getBytes("UTF-8"));
			Source xmlSource = new StreamSource(inputStreamXml);
			TransformerFactory factoriaTrans = TransformerFactory.newInstance();
			factoriaTrans.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
			factoriaTrans.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
			Transformer transformador = factoriaTrans.newTransformer(xsltSource);
			transformador.transform(xmlSource, bufferResultado);
		} catch (URISyntaxException e) {
			XMLConvert.logger.error(e);
		}
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

		String dateResult = "";
		if (dateString.length() == 8) {
			dateResult += dateString.substring(6, 8);
			dateResult += " de ";
			switch (Integer.parseInt(dateString.substring(4, 6))) {
			case 1:
				dateResult += "Enero";
				break;
			case 2:
				dateResult += "Febrero";
				break;
			case 3:
				dateResult += "Marzo";
				break;
			case 4:
				dateResult += "Abril";
				break;
			case 5:
				dateResult += "Mayo";
				break;
			case 6:
				dateResult += "Junio";
				break;
			case 7:
				dateResult += "Julio";
				break;
			case 8:
				dateResult += "Agosto";
				break;
			case 9:
				dateResult += "Septiembre";
				break;
			case 10:
				dateResult += "Octubre";
				break;
			case 11:
				dateResult += "Noviembre";
				break;
			case 12:
				dateResult += "Diciembre";
				break;
			default:
				dateResult += "";
			}
			dateResult += " de ";
			dateResult += dateString.substring(0, 4);
		}

		return dateResult;
	}

	public static String getKYCPersFisXML4PDF(final String xmlKYC) {
		// Armar Document
		Document doc = strXML2Doc(xmlKYC);
		Element root = doc.getDocumentElement();
		Node node = null;
		// Remplazar campos
		node = getNodeByName(root, "estadoKYC");
		node.setTextContent(getNodeByName(node, "descripcion").getTextContent());
		node = getNodeByName(root, "tipoDoc");
		node.setTextContent(getNodeByName(node, "name").getTextContent());
		node = getNodeByName(root, "nacionalidad");
		node.setTextContent(getNodeByName(node, "name").getTextContent());
		node = getNodeByName(root, "dirProvincia");
		node.setTextContent(getNodeByName(node, "name").getTextContent());
		node = getNodeByName(root, "condicionIVA");
		node.setTextContent(getNodeByName(node, "name").getTextContent());
		node = getNodeByName(root, "actividad");
		node.setTextContent(getNodeByName(node, "name").getTextContent());
		// Representantes
		NodeList nodeList = null;
		nodeList = getNodeListByName(getNodeByName(root, "representanteList"), "representante");
		for (int i = 0; i < nodeList.getLength(); i++) {
			node = getNodeByName(nodeList.item(i), "tipoDoc");
			node.setTextContent(getNodeByName(node, "name").getTextContent());
		}
		// Titular Medio Pago
		nodeList = getNodeListByName(getNodeByName(root, "titMPagoList"), "titularMedioPago");
		for (int i = 0; i < nodeList.getLength(); i++) {
			node = getNodeByName(nodeList.item(i), "tipoDoc");
			node.setTextContent(getNodeByName(node, "name").getTextContent());
		}
		// Agregar Fecha
		Element dateElement = doc.createElement("fechaHoy");
		dateElement.setTextContent(getDateText());
		root.appendChild(dateElement);

		return doc2StrXML(doc);
	}

	public static String getKYCPersJurXML4PDF(final String xmlKYC) {
		// Armar Document
		Document doc = strXML2Doc(xmlKYC);
		Element root = doc.getDocumentElement();
		Node node = null;
		// Remplazar campos
		node = getNodeByName(root, "estadoKYC");
		node.setTextContent(getNodeByName(node, "descripcion").getTextContent());
		node = getNodeByName(root, "dirProvincia");
		node.setTextContent(getNodeByName(node, "name").getTextContent());
		node = getNodeByName(root, "caracter");
		node.setTextContent(getNodeByName(node, "name").getTextContent());
		node = getNodeByName(root, "actividad");
		node.setTextContent(getNodeByName(node, "name").getTextContent());
		// Representantes
		NodeList nodeList = null;
		nodeList = getNodeListByName(getNodeByName(root, "representanteList"), "representante");
		for (int i = 0; i < nodeList.getLength(); i++) {
			node = getNodeByName(nodeList.item(i), "tipoDoc");
			node.setTextContent(getNodeByName(node, "name").getTextContent());
		}
		// Titular Medio Pago
		nodeList = getNodeListByName(getNodeByName(root, "titMPagoList"), "titularMedioPago");
		for (int i = 0; i < nodeList.getLength(); i++) {
			node = getNodeByName(nodeList.item(i), "tipoDoc");
			node.setTextContent(getNodeByName(node, "name").getTextContent());
		}
		// Agregar Fecha
		Element dateElement = doc.createElement("fechaHoy");
		dateElement.setTextContent(getDateText());
		root.appendChild(dateElement);

		return doc2StrXML(doc);
	}
}

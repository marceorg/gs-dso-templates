/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.service.utils;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;

import org.springframework.jms.core.MessageCreator;

public class MsgCreator implements MessageCreator {
	// message is of type javax.jms.Message
	private Message message;
	private String request;

	// Generate getter and setter for the message
	public Message getMessage() {
		return this.message;
	}

	public void setMessage(final Message message) {
		this.message = message;
	}

	public String getRequest() {
		return this.request;
	}

	public void setRequest(final String request) {
		this.request = request;
	}

	public Message createMessage(final Session session) throws JMSException {
		this.message = session.createTextMessage(this.request);
		return this.message;
	}
}

/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import { MattermostClient } from '../../../../src/plugins/mattermost/MattermostClient';
import { MattermostMiddleware } from '../../../../src/plugins/mattermost/MattermostMiddleware';
import { IChannel, IChattingType, IMattermostOption, IMessageType } from '../../../../src/types';
import { MockCommonBot } from '../../../common/mocks/MockCommonBot';
import { MockContexts } from '../../../common/mocks/MockContexts';

describe('Middleware Tests', () => {
  it('Mattermost DirectMessage', async () => {
    const ctx = MockContexts.MM_SIMPLE_CTX;
    const testMsg = {
      type: IMessageType.PLAIN_TEXT,
      message: 'Test DM',
    };
    const testChanId: IChannel = {
      id: 'mock_id',
      name: 'mock_name',
      chattingType: IChattingType.PERSONAL,
    };

    const middleware = new MattermostMiddleware(MockCommonBot.MATTERMOST_BOT);
    const client = new MattermostClient(middleware, {
      protocol: 'https',
      tlsCertificate: '',
    } as IMattermostOption);

    client.createDmChannel = jest.fn(() => {
      return new Promise<IChannel>((resolve) => {
        resolve(testChanId);
      });
    });
    client.sendMessage = jest.fn(() => {
      return new Promise((resolve) => {
        resolve();
      });
    });

    (middleware as any).client = client;

    await middleware.sendDirectMessage(ctx, [testMsg]);
    expect(client.createDmChannel).toHaveBeenCalledWith(ctx.context.chatting.user, null);
    expect(client.sendMessage).toHaveBeenCalledWith(testMsg.message, testChanId.id, ctx.context.chatTool.rootId);

    // Case where CreateDm fails
    jest.clearAllMocks();

    client.createDmChannel = jest.fn(() => {
      return new Promise<IChannel>((resolve) => {
        resolve(null as any);
      });
    });

    await middleware.sendDirectMessage(ctx, [testMsg]);
    expect(client.createDmChannel).toHaveBeenCalledWith(ctx.context.chatting.user, null);
    expect(client.sendMessage).toHaveBeenCalledTimes(0);
  });
});
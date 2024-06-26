import React, { useMemo } from 'react';
import {
  Label,
  List,
  Popup,
  Ref,
} from 'semantic-ui-react';
import cn from 'classnames';
import _ from 'lodash';
import { shortLabelForActivityCode } from '../../../lib/utils/wcif';
import { formats } from '../../../lib/wca-data.js.erb';
import { activityToFcTitle, buildPartialActivityFromCode } from '../../../lib/utils/edit-schedule';

function ActivityPicker({
  wcifEvents,
  wcifRoom,
  listRef,
}) {
  return (
    <>
      <Ref innerRef={listRef}>
        <List relaxed>
          {wcifEvents.map((event) => (
            <List.Item key={event.id}>
              <List.Icon
                className={cn('cubing-icon', `event-${event.id}`)}
                verticalAlign="middle"
                size="large"
              />
              <List.Content>
                {event.rounds.map((round) => (
                  <PickerRow
                    key={round.id}
                    wcifRoom={wcifRoom}
                    wcifEvent={event}
                    wcifRound={round}
                  />
                ))}
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Ref>
      <p>
        Want to add a custom activity such as lunch or registration?
        Click and select a timeframe on the calendar!
      </p>
    </>
  );
}

function PickerRow({
  wcifRoom,
  wcifEvent,
  wcifRound,
}) {
  if (['333fm', '333mbf'].includes(wcifEvent.id)) {
    const numberOfAttempts = formats.byId[wcifRound.format].expectedSolveCount;

    return _.times(numberOfAttempts, (n) => (
      <ActivityLabel
        key={n}
        wcifRoom={wcifRoom}
        activityCode={`${wcifRound.id}-a${n + 1}`}
      />
    ));
  }

  return (
    <ActivityLabel
      wcifRoom={wcifRoom}
      activityCode={wcifRound.id}
    />
  );
}

function ActivityLabel({
  wcifRoom,
  activityCode,
}) {
  const usedActivityCodes = useMemo(
    () => wcifRoom.activities.map((activity) => activity.activityCode),
    [wcifRoom.activities],
  );

  const isEnabled = !usedActivityCodes.includes(activityCode);

  const partialActivity = buildPartialActivityFromCode(activityCode);

  return (
    <Popup
      content={activityToFcTitle(partialActivity)}
      trigger={(
        <Label
          className={isEnabled ? 'fc-draggable' : ''}
          color={isEnabled ? 'blue' : 'grey'}
          wcif-ac={activityCode}
        >
          {shortLabelForActivityCode(activityCode)}
        </Label>
      )}
    />
  );
}

export default ActivityPicker;

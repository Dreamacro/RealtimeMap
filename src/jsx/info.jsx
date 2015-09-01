class AttackList extends React.Component {
    render() {
        let country = [];
        for(let key of Object.keys(this.props.list)) {
            country.push({
                country: key,
                count: this.props.list[key]
            });
        }

        return (
            <table className={ this.props.className }>
                <tr>
                  <th>#</th>
                  <th>{ this.props.className == 'attackorigin' ? 'Origin' : 'Targets' }</th>
                </tr>
                {
                    country
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 9)
                        .map((item) => {
                            return (
                                <tr>
                                  <td>{ item.count }</td>
                                  <td>{ item.country }</td>
                                </tr>
                            );
                        })
                }
            </table>
        );
    }
}

class RealTimeList extends React.Component {
    render () {

        return (
            <table className={ this.props.className }>
                <tbody>
                    <tr className="first-head">
                      <th>Timestamp</th>
                      <th colSpan="3">Attacker</th>
                      <th>Target</th>
                      <th colSpan="2">Type</th>
                    </tr>
                    <tr>
                      <th width="200px"></th>
                      <th width="280px">Origin</th>
                      <th width="240px">Location</th>
                      <th width="160px">IP</th>
                      <th width="200px">Location</th>
                      <th width="100px">Service</th>
                      <th>Port</th>
                    </tr>
                </tbody>
                { this.props.realtime.map((item) => {
                    return (
                        <tr>
                          <td>{ item.Time }</td>
                          <td>{ item.Origin.org }</td>
                          <td>{ item.Origin.location }</td>
                          <td>{ item.Origin.ip }</td>
                          <td>{ item.Targets }</td>
                          <td>{ item.Type.service }</td>
                          <td>{ item.Type.port }</td>
                        </tr>
                    );
                }) }
            </table>
        );
    }
}

class Info extends React.Component {
    render() {
        return (
            <div className="info">
                <AttackList list={ this.props.origin } className="attackorigin" />
                <AttackList list={ this.props.targets } className="attacktargets" />
                <RealTimeList realtime={ this.props.realtime } className="realtime" />
            </div>
        );
    }
}

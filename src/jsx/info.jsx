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
                  <th>{ this.props.className == 'attackorigin' ? 'Origin' : 'Targets' }</th>
                  <th>Count</th>
                </tr>
                {
                    country
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 9)
                        .map((item) => {
                            return (
                                <tr>
                                  <td>{ item.country }</td>
                                  <td>{ item.count }</td>
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
                <tr>
                  <th>Time</th>
                  <th>Origin</th>
                  <th>Targets</th>
                  <th>Type</th>
                </tr>
                { this.props.realtime.map((item) => {
                    return (
                        <tr>
                          <td width="200">{ item.Time }</td>
                          <td>{ item.Origin }</td>
                          <td width="200">{ item.Targets }</td>
                          <td>{ item.Type }</td>
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

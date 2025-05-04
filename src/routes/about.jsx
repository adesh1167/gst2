import Header from '../components/header'
import "./styles/about.css";

const About = () => {
    return (
        <div className="about-container">
            <Header />
            <div className="about-details">
                <div className="details-section question">
                    <div className="section-title">
                        <h3>How Does GST Work?</h3>
                    </div>
                    <div className="section-body">
                        <p>
                            <b>Global Sports Trade</b> is an all sport organization. We work on
                            the principle of Safe Staking, utilizing every possible strategy to
                            guarantee accurate predictions
                        </p>
                        <p>
                            Now, we are harnessing the strength and accuracy of{" "}
                            <b>Artificial Intelligence</b> to make prediction of sport events.
                        </p>
                    </div>
                </div>
                <div className="about-hero hero-consistency">
                    <div className="about-container14">
                        <h1 className="about-text04">Consistency</h1>
                        <span className="about-text05">
                            <span>
                                <span>
                                    All matches are predicted using <b>Artificial Intelligence</b>.
                                    Results are consistent across multiple trials.
                                </span>
                                <span />
                            </span>
                        </span>
                    </div>
                </div>
                <div className="details-group">
                    <div className="details-section ">
                        <div className="section-title">
                            <h3>Accuracy Is Key</h3>
                        </div>
                        <div className="section-body">
                            <p>
                                AI has been known to outperform humans in accuracy and consistency.
                                AI models can be trained to specailize in any field and here, we
                                trained our model to forecast outcomes of sports events based on
                                several parameters.
                            </p>
                            <p>
                                The model has come a long way since its first prediction in December
                                2021 and it's still learning. With an average accuracy of over 92%,
                                it is now fully ready for publlic use.
                            </p>
                        </div>
                    </div>
                    <div className="about-hero hero-accuracy dynamic">
                        <div className="about-container14">
                            <h1 className="about-text04">Accuracy</h1>
                            <span className="about-text05">
                                <span>
                                    <span>
                                        Only forecasts with over 94% accuracy are added to the
                                        prediction list. Available predictions are extremely safe.
                                    </span>
                                    <span />
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="details-group">
                    <div className="details-section">
                        <div className="section-title">
                            <h3>It's For The Masses</h3>
                        </div>
                        <div className="section-body">
                            <p>
                                The demography of bet players is dominated by a population with low
                                income and limited resources. Even though the cost and expertise of
                                Artificial Intelligence is on the high, we've found a nuetral ground
                                between cost and affordability.{" "}
                            </p>
                            <p>
                                By patnering with investors, we've been able to keep the prices
                                extremely low.
                            </p>
                        </div>
                    </div>
                    <div className="about-hero hero-affordability dynamic">
                        <div className="about-container14">
                            <h1 className="about-text04">Affordability</h1>
                            <span className="about-text05">
                                <span>
                                    <span>
                                        With consideration for the masses, the prices have been
                                        extremely subsidized to ensure accessibility.
                                    </span>
                                    <span />
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="details-section">
                    <div className="section-body">
                        <p className="quote">
                            <i>
                                "It is worth stating that GST is not afilliated to any bookmaker"
                            </i>
                        </p>
                    </div>
                </div>
                <footer className='about-footer'>
                    <div className="dag-container02">
                        <img alt="image" src="assets/logo.png" className="dag-image" />
                        <span className="dag-text">
                            <span>GST</span>
                        </span>
                    </div>
                    <div className="about-footer-text">
                        <span>Gamble Responsibly</span>
                        <span> | </span>
                        <span>18+ Legal Betting</span>
                    </div>
                </footer>
            </div>
        </div>

    )
}

export default About
